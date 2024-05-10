import express from 'express'
import multer from 'multer'
import fs from 'fs'
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validation.js';
import cors from 'cors'

import { checkAuth, handleValidationErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'



mongoose
    .connect(
        'mongodb+srv://admin:2201009395601Ki@cluster0.hy4bqyx.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('Error DB', err))


const app = express()

const storage = multer.diskStorage({
    // Фунцкия которая возвращает путь загружаемого файла
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    // Перед тем как сохранить поймет как назвать файл
    filename: (_, file, cb) => {
        // if (fs.existsSync('uploads')){
        //     fs.mkdirSync('uploads')
        // }
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json()); //Даем возможность express работать с json
app.use(cors());
app.use('/uploads', express.static('uploads')) //если приходит запрос на uploads то не гет запрос отправлять, а получать доступ к папке 
// routes AUTH
app.post('/auth/login/', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register/', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,

    })
})
// routes POST CRUD POSTS
app.get('/tags', PostController.getLastTags)
app.get('/posts/', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts/', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(4444, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('Server OK')
})