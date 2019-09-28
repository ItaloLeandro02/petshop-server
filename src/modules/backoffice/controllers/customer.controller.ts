import { Controller, Get, Post, Param, Body, UseInterceptors, HttpException, HttpStatus, Put } from '@nestjs/common';
import { Result } from '../models/result.model';
import { ValidatorInterceptor } from '../../../interceptors/validator.interceptor';
import { CreateCustomerContract } from '../contracts/customer/create-customer.contract';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import { AccountService } from '../services/account.service';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';
import { QueryDto } from '../dtos/query.dto';
import { UpdateCustomerContract } from '../contracts/customer/update-customer.contract';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { CreateCreditCardContract } from '../contracts/customer/create-credit-card.contract';
import { async } from 'rxjs/internal/scheduler/async';
import { CreditCard } from '../models/credit-card.model';
import { QueryContract } from '../contracts/query.contract';

@Controller('v1/customers') 
export class CustomerController {
    constructor(
        private readonly accountService:AccountService,
        private readonly customerService:CustomerService        
    ) {} 

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

    @Post('query')
    @UseInterceptors(new ValidatorInterceptor(new QueryContract()))
    async query(@Body() model: QueryDto) {
        const customers = await this.customerService.query(model);
        return new Result(null, true, customers, null);
    }

    @Put(':document')
    @UseInterceptors(new ValidatorInterceptor(new UpdateCustomerContract()))
    async update(@Param('document') document, @Body() model: UpdateCustomerDto) {
        try {
            await this.customerService.update(document, model);
            return new Result(null, true, model, null);
        } catch (error) {
            throw new HttpException(new Result('Não foi possível atualizar seus dados', false, null, error), HttpStatus.BAD_REQUEST);            
        }
    }

    @Post(':document/credit-cards')
    @UseInterceptors(new ValidatorInterceptor(new CreateCreditCardContract()))
    async createBilling(@Param('document') document, @Body() model: CreditCard) {
        try {
            await this.customerService.saveOrUpdateCreditCard(document, model);
            return new Result(null, true, model, null); 
        } catch (error) {
            throw new HttpException(new Result('Não foi possível adicionar seu cartão de crédito', false, null, error), HttpStatus.BAD_REQUEST);
        }
    }
}