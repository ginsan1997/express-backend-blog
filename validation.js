import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов для пароля').isLength({min: 5}),
    
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Минимум 5 символов для пароля').isLength({min: 5}),
    body('fullName', 'Введите полное имя').isLength({min: 3}),
    body('avatarUrl', 'Невалидная ссылка, вставьте другое изображение').optional().isURL(), //optional дает понять пришло или нет. Не обязатеьно, но если пригло, проверяет
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(), 
];