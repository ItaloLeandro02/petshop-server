import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';
import { Model } from 'mongoose'
import { AddressType } from '../enums/address-type.enum';

@Injectable()
export class AddressService {
    constructor(@InjectModel('Customer') private readonly model: Model<Customer>) {

    }

    async create(document: string, data: Address, type: AddressType) : Promise<Customer> {
        const options = { upsert: true };
        if (type == AddressType.Billing) {
            return await this.model.findOneAndUpdate({ document }, {
                $set: {
                    billingAddress: data,
                },
            }, options);
        } else {
            return await this.model.findOneAndUpdate({ document }, {
                $set: {
                    shippingAddress: data
                },
            }, options);
        }
    }
}