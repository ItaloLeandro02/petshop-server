import { Controller, Get, Put, Post, Delete, Param, Body, UseInterceptors, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Result } from '../models/result.model';
import { ValidatorInterceptor } from '../../interceptors/validator.interceptor';
import { CreateCustomerContract } from '../contracts/customer/create-customer.contract';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { AccountService } from '../services/account.service';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';
import { async } from 'rxjs/internal/scheduler/async';
import { Address } from '../models/address.model';
import { CreateAddressContract } from '../contracts/customer/create-address.contracr';
import { CreatePetContract } from '../contracts/customer/create-pet.contract';
import { Pet } from '../models/pet.model';
import { identifier } from '@babel/types';
import { QueryDto } from '../dtos/query.dto';

@Controller('v1/customers') 
export class CustomerController {
    constructor(
        private readonly accountService:AccountService,
        private readonly customerService:CustomerService
        ) {

    } 

    @Get()
    async getAll() {
        const customers = await this.customerService.findAll();
        return new Result(null, true, customers, null);
    }

    @Get(':document')
    async get(@Param('document') document) {
        const customer = await this.customerService.find(document);
        return new Result(null, true, customer, null);
    }

    @Post()
    @UseInterceptors(new ValidatorInterceptor(new CreateCustomerContract()))
    async post(@Body() model: CreateCustomerDto) {
        try {
            
            const user = await this.accountService.create(
                new User(model.document, model.password, true)
            );
    
            const customer = new Customer(model.name, model.document, model.email, null, null, null, null, user);
            const res = await this.customerService.create(customer);
    
            return new Result('Cliente criado com sucecsso!', true, res, null);

        } catch (error) {
            throw new HttpException(new Result('Não foi possível realizar seu cadastro', false, null, error), HttpStatus.BAD_REQUEST);            
        }
    }

    @Post(':document/addresses/billing')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addBillingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.customerService.addBillingAddress(document, model);
            return new Result(null, true, model, null);  
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/addresses/shipping')
    @UseInterceptors(new ValidatorInterceptor(new CreateAddressContract()))
    async addShippingAddress(@Param('document') document, @Body() model: Address) {
        try {
            await this.customerService.addShippingAddress(document, model);
            return new Result(null, true, model, null); 
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu endereço', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post(':document/pets')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async createPet(@Param('document') document, @Body() model: Pet) {
        try {
            await this.customerService.createPet(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível criar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('query')
    async query(@Body() model: QueryDto) {
        const customers = await this.customerService.query(model);
        return new Result(null, true, customers, null);
    }

    @Put(':document/pets/:id')
    @UseInterceptors(new ValidatorInterceptor(new CreatePetContract()))
    async updatePet(@Param('document') document, @Param('id') id, @Body() model: Pet) {
        try {
            await this.customerService.updatePet(document, id, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível atualizar seu pet', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}