import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Customer } from '../models/customer.model';
import { Address } from '../models/address.model';
import { Pet } from '../models/pet.model';
import { QueryDto } from '../dtos/query.dto';
import { Model } from 'mongoose'

@Injectable()
export class CustomerService {
    constructor(@InjectModel('Customer') private readonly model: Model<Customer>) {

    }
    async create(data: Customer)
        : Promise<Customer>  {
        const customer = new this.model(data);
        return await customer.save();
    }

    async createPet(document: string, data: Pet) 
        : Promise<Customer> {
            
        const options = { upsert: true, new: true };

        return await this.model.findOneAndUpdate({ document }, {
            $push: {
                pets: data,
            },
        }, options);
    }

    async updatePet(document: string, id: string, data: Pet): Promise<Customer> {
        return await this.model.findOneAndUpdate({ 
            document, 'pets._id': id }, {
                $set: {
                    'pets.$': data,
                },
        });
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
}