const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job reference is required']
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Candidate reference is required']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
        default: 'pending'
    },
    documents: {
        resume: {
            type: String,
            required: [true, 'Resume is required']
        },
        coverLetter: {
            type: String,
            maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
        },
        portfolio: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^(https?:\/\/)/.test(v);
                },
                message: 'Please provide a valid URL'
            }
        }
    },
    companyNotes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    interviewDetails: {
        scheduled: {
            type: Boolean,
            default: false
        },
        date: Date,
        type: {
            type: String,
            enum: ['phone', 'video', 'onsite', 'technical']
        },
        meetingLink: String,
        notes: String,
        feedback: String
    },
    timeline: [{
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    viewedAt: Date,
    respondedAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ candidate: 1, createdAt: -1 });
applicationSchema.index({ status: 1, createdAt: 1 });
applicationSchema.index({ 'interviewDetails.scheduled': 1, 'interviewDetails.date': 1 });

applicationSchema.pre('save', function() {
    if (this.isModified('status')) {
        this.timeline.push({
            status: this.status,
            timestamp: new Date(),
            note: this.companyNotes
        });
        
        if (this.status !== 'pending' && !this.respondedAt) {
            this.respondedAt = new Date();
        }
        
        if (this.status === 'reviewed' && !this.viewedAt) {
            this.viewedAt = new Date();
        }
    }
});

applicationSchema.methods.updateStatus = async function(newStatus, note = '', userId = null) {
    this.status = newStatus;
    
    if (note) this.companyNotes = note;
    
    this.timeline.push({
        status: newStatus,
        timestamp: new Date(),
        note: note,
        updatedBy: userId
    });
    
    return await this.save();
};

applicationSchema.methods.scheduleInterview = async function(interviewData) {
    this.interviewDetails = {
        scheduled: true,
        date: interviewData.date,
        type: interviewData.type,
        meetingLink: interviewData.meetingLink,
        notes: interviewData.notes
    };
    
    this.status = 'shortlisted';
    
    this.timeline.push({
        status: 'shortlisted',
        timestamp: new Date(),
        note: `Interview scheduled for ${new Date(interviewData.date).toLocaleString()}`
    });
    
    return await this.save();
};

applicationSchema.methods.addInterviewFeedback = async function(feedback, rating = null) {
    this.interviewDetails.feedback = feedback;
    if (rating) this.rating = rating;
    return await this.save();
};

applicationSchema.methods.canWithdraw = function() {
    return ['pending', 'reviewed', 'shortlisted'].includes(this.status);
};

applicationSchema.methods.withdraw = async function(reason = '') {
    if (!this.canWithdraw()) {
        throw new Error('Cannot withdraw application at current status');
    }
    
    this.status = 'withdrawn';
    this.timeline.push({
        status: 'withdrawn',
        timestamp: new Date(),
        note: `Application withdrawn. Reason: ${reason || 'Not specified'}`
    });
    
    return await this.save();
};

applicationSchema.statics.hasApplied = async function(jobId, candidateId) {
    const application = await this.findOne({ job: jobId, candidate: candidateId });
    return !!application;
};

applicationSchema.statics.getCompanyApplications = async function(companyId, status = null) {
    const Job = mongoose.model('Job');
    
    const jobs = await Job.find({ company: companyId }).select('_id');
    const jobIds = jobs.map(job => job._id);
    
    const query = { job: { $in: jobIds } };
    if (status) query.status = status;
    
    return await this.find(query)
        .populate('candidate', 'name email avatar')
        .populate('job', 'title location compensation.salaryMin compensation.salaryMax')
        .sort({ createdAt: -1 });
};

applicationSchema.statics.getJobStats = async function(jobId) {
    const stats = await this.aggregate([
        { $match: { job: jobId } },
        { $group: {
            _id: '$status',
            count: { $sum: 1 }
        }}
    ]);
    
    const result = {
        total: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
        hired: 0,
        withdrawn: 0
    };
    
    stats.forEach(stat => {
        result[stat._id] = stat.count;
        result.total += stat.count;
    });
    
    return result;
};

applicationSchema.statics.getByDateRange = async function(startDate, endDate, companyId = null) {
    let query = { createdAt: { $gte: startDate, $lte: endDate } };
    
    if (companyId) {
        const Job = mongoose.model('Job');
        const jobs = await Job.find({ company: companyId }).select('_id');
        query.job = { $in: jobs.map(j => j._id) };
    }
    
    return await this.find(query)
        .populate('job', 'title company')
        .populate('candidate', 'name email');
};

applicationSchema.virtual('candidateDetails', {
    ref: 'User',
    localField: 'candidate',
    foreignField: '_id',
    justOne: true
});

applicationSchema.virtual('jobDetails', {
    ref: 'Job',
    localField: 'job',
    foreignField: '_id',
    justOne: true
});

applicationSchema.virtual('timeSinceApplied').get(function() {
    const minutes = Math.floor((new Date() - this.createdAt) / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
});

applicationSchema.virtual('statusColor').get(function() {
    const colors = {
        pending: '#F59E0B',
        reviewed: '#3B82F6',
        shortlisted: '#10B981',
        rejected: '#EF4444',
        hired: '#8B5CF6',
        withdrawn: '#6B7280'
    };
    return colors[this.status] || '#6B7280';
});

module.exports = mongoose.model('Application', applicationSchema);