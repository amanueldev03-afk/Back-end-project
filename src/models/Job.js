const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, 'Company reference is required']
    },
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        minlength: [50, 'Description must be at least 50 characters']
    },
    requirements: [{
        type: String,
        required: true
    }],
    responsibilities: [{
        type: String
    }],
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    compensation: {
        salaryMin: {
            type: Number,
            required: true,
            min: 0
        },
        salaryMax: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: function(value) {
                    return value >= this.compensation.salaryMin;
                },
                message: 'Maximum salary must be greater than or equal to minimum salary'
            }
        },
        currency: {
            type: String,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
        },
        salaryPeriod: {
            type: String,
            enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
            default: 'yearly'
        },
        isNegotiable: {
            type: Boolean,
            default: false
        }
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'remote'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
        required: true
    },
    skills: [{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }],
    benefits: [{
        type: String
    }],
    deadline: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Deadline must be in the future'
        }
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed', 'expired'],
        default: 'published'
    },
    metadata: {
        views: {
            type: Number,
            default: 0
        },
        applications: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        featured: {
            type: Boolean,
            default: false
        },
        urgent: {
            type: Boolean,
            default: false
        }
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    closedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

jobSchema.index({ title: 'text', description: 'text', requirements: 'text', skills: 'text' });
jobSchema.index({ company: 1, createdAt: -1 });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ employmentType: 1, location: 1 });
jobSchema.index({ skills: 1, experienceLevel: 1 });
jobSchema.index({ 'metadata.featured': -1, createdAt: -1 });

jobSchema.pre('save', function() {
    if (this.deadline < new Date()) {
        this.status = 'expired';
    }
    
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    if (this.isModified('status') && this.status === 'closed') {
        this.closedAt = new Date();
    }
});

jobSchema.methods.isExpired = function() {
    return this.deadline < new Date();
};

jobSchema.methods.isAcceptingApplications = function() {
    return this.status === 'published' && !this.isExpired();
};

jobSchema.methods.incrementViews = async function() {
    this.metadata.views += 1;
    return await this.save();
};

jobSchema.methods.incrementApplications = async function() {
    this.metadata.applications += 1;
    return await this.save();
};

jobSchema.methods.close = async function() {
    this.status = 'closed';
    this.closedAt = new Date();
    return await this.save();
};

jobSchema.methods.getSalaryRange = function() {
    const { salaryMin, salaryMax, currency, salaryPeriod } = this.compensation;
    const formatSalary = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num.toString();
    };
    
    const periodMap = {
        hourly: '/hr',
        daily: '/day',
        weekly: '/week',
        monthly: '/mo',
        yearly: '/yr'
    };
    
    return `${currency} ${formatSalary(salaryMin)} - ${formatSalary(salaryMax)}${periodMap[salaryPeriod]}`;
};

jobSchema.statics.findActive = function() {
    return this.find({
        status: 'published',
        deadline: { $gt: new Date() }
    });
};

jobSchema.statics.searchWithFilters = function(filters) {
    let query = {};
    
    if (filters.search) {
        query.$text = { $search: filters.search };
    }
    
    if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
    }
    
    if (filters.employmentType) {
        query.employmentType = filters.employmentType;
    }
    
    if (filters.experienceLevel) {
        query.experienceLevel = filters.experienceLevel;
    }
    
    if (filters.skills && filters.skills.length) {
        query.skills = { $in: filters.skills };
    }
    
    if (filters.minSalary) {
        query['compensation.salaryMax'] = { $gte: filters.minSalary };
    }
    
    if (filters.isRemote !== undefined) {
        query.isRemote = filters.isRemote;
    }
    
    query.status = 'published';
    query.deadline = { $gt: new Date() };
    
    return this.find(query);
};

jobSchema.statics.getStatistics = async function(companyId = null) {
    const matchStage = companyId ? { company: companyId } : {};
    
    const stats = await this.aggregate([
        { $match: matchStage },
        { $group: {
            _id: null,
            totalJobs: { $sum: 1 },
            activeJobs: {
                $sum: {
                    $cond: [
                        { $and: [
                            { $eq: ['$status', 'published'] },
                            { $gt: ['$deadline', new Date()] }
                        ]},
                        1, 0
                    ]
                }
            },
            totalViews: { $sum: '$metadata.views' },
            totalApplications: { $sum: '$metadata.applications' },
            avgSalaryMin: { $avg: '$compensation.salaryMin' },
            avgSalaryMax: { $avg: '$compensation.salaryMax' }
        }}
    ]);
    
    return stats[0] || {
        totalJobs: 0,
        activeJobs: 0,
        closedJobs: 0,
        totalViews: 0,
        totalApplications: 0,
        avgSalaryRange: '0 - 0'
    };
};

jobSchema.statics.getTopSkills = async function(limit = 10) {
    return await this.aggregate([
        { $match: { status: 'published' } },
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { skill: '$_id', count: 1, _id: 0 } }
    ]);
};

jobSchema.virtual('companyDetails', {
    ref: 'Company',
    localField: 'company',
    foreignField: '_id',
    justOne: true
});

jobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'job'
});

jobSchema.virtual('daysRemaining').get(function() {
    const remaining = this.deadline - new Date();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
});

jobSchema.virtual('isHot').get(function() {
    return this.metadata.views > 100 || this.metadata.urgent;
});

module.exports = mongoose.model('Job', jobSchema);