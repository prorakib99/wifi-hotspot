import mongoose, { Schema } from 'mongoose';

const packageSchema = new Schema(
    {
        packageName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        desktopPrice: {
            type: Number,
            required: true,
            default: 0
        },
        discountPercentage: {
            type: Number,
            required: false
        },
        profileName: {
            type: String,
            required: true
        },
        hotspotServer: {
            type: String
        },
        validity: {
            type: Number,
            required: true,
            default: 0
        },
        speedLimit: {
            type: String,
            required: true,
            default: ''
        }
    },
    { timestamps: true }
);

const Package = mongoose?.models?.Package ?? mongoose.model('Package', packageSchema);

export default Package;
