import { Inject, Injectable } from "@nestjs/common";
import { 
    ValidationArguments, 
    ValidatorConstraint, 
    ValidatorConstraintInterface 
} from "class-validator";
import { NewsCategoriesService } from "../news-categories.service";

@ValidatorConstraint({ name: 'CategoriesExistsValidator', async: true })
@Injectable()
export class CategoriesExistsValidator {
  
    constructor(
        @Inject('NewsCategoriesService') private readonly categoryService: NewsCategoriesService) {
        
    }

    async validate(value: string) {
      
        const category = await this.categoryService.findCategoryById(value);
        console.log(category);
        try {
           
            if(!category) return false;
        } catch (e) {
            return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Categories doesn't exist`;
    }
}

