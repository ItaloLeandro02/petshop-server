import * as mongoose from 'mongoose';

export const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    document: {
        type: String,
        required: true,
        trim: true,
        index: {
            unique: true,
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: {
            unique: true,
        },
    },
    pets: [
        {
            name: {
                type: String,
            },
            gender: {
                type: String,
                enum: ['male', 'female', 'none'],
            },
            kind: {
                type: String,
            },
            brand: {
                type: String,
            },
        },
    ],
    billingAddress: {
        zipcode: {
            type: String,
        },
        street: {
            type: String,
        },
        number: {
            type: String,
        },
        complement: {
            type: String,
        },
        neighborhood: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
    },
})