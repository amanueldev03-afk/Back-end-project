const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        unique: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Company description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    website: {
        type: String,
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please enter a valid URL']
    },
    location: {
        address: {
            type: String,
            required: [true, 'Address is required']
        },
        city: {
            type: String,
            required: true
        },
        state: String,
        country: {
            type: String,
            required: true,
            default: 'USA'
        },
        zipCode: String
    },
    logo: {
        type: String,
        default: 'default-company-logo.png'
    },
    industry: {
        type: String,
        required: [true, 'Industry is required'],
        enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Construction', 'Hospitality', 'Other']
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    foundedYear: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
    },
    benefits: [{
        type: String,
        enum: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Paid Time Off', 'Stock Options', 'Tuition Reimbursement']
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

companySchema.index({ companyName: 'text' });
companySchema.index({ industry: 1 });
companySchema.index({ 'location.city': 1, 'location.country': 1 });

companySchema.pre('save', function() {
    if (this.isModified('companyName')) {
        this.companyName = this.companyName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
});

companySchema.methods.getJobCount = async function() {
    const Job = mongoose.model('Job');
    return await Job.countDocuments({ company: this._id, isActive: true });
};

companySchema.methods.updateRating = async function(newRating) {
    const total = (this.rating.average * this.rating.count) + newRating;
    this.rating.count += 1;
    this.rating.average = total / this.rating.count;
    return await this.save();
};

companySchema.statics.findByIndustry = function(industry) {
    return this.find({ industry: industry, isActive: true });
};

companySchema.statics.search = function(searchTerm) {
    return this.find(
        { $text: { $search: searchTerm }, isActive: true },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
};

companySchema.virtual('jobs', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'company'
});

companySchema.virtual('fullAddress').get(function() {
    const parts = [this.location.address, this.location.city, this.location.state, this.location.zipCode, this.location.country].filter(Boolean);
    return parts.join(', ');
});

module.exports = mongoose.model('Company', companySchema);