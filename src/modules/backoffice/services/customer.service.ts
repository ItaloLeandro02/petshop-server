import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Customer } from '../models/customer.model';
import { QueryDto } from '../dtos/query.dto';
import { Model } from 'mongoose'
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { CreditCard } from '../models/credit-card.model';

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private readonly model: Model<Customer>) {

    }
    async create(data: Customer)
        : Promise<Customer>  {
        const customer = new this.model(data);
        return await customer.save();
    }

    async update(document: string, data: UpdateCustomerDto): Promise<Customer> {
        return await this.model.findOneAndUpdate({ document }, data);
    }

    async findAll(): Promise<Customer[]> {
        // Primeiro parâmetro é a query
        // Segundo parâmetro são os campos que serão retornados
        return await this.model
        .find({}, 'name email document')
        .sort('name') // Ordena pelo nome; -name ordena de forma decrescente
        .exec();
    }

    async find(document: string): Promise<Customer> {
        return await this.model
        .find({ document })
        .populate('user', 'username') // Quem eu quero popular e o quê ele deve retornar
        .exec();
    }

    async query(model: QueryDto): Promise<Customer[]> {
        return await this.model
        .find(model.query, model.fields, 
            { 
                skip: model.skip, 
                limit: model.take,
            })
        .exec();
    }

    async saveOrUpdateCreditCard(document: string, data: CreditCard): Promise<Customer> {
        const options = { upsert: true };
        return await this.model.findOneAndUpdate({ document }, {
            $set: {
                card: data,
            },
        }, options);
    }
}