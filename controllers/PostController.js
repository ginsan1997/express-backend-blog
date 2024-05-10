import PostModel from "./../models/Post.js"

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
        res.json(tags)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи '
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().sort('-createdAt').populate('user').exec();

        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи '
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId //тут мы из checkAuth берем айди пользователя. Того пользователя, который авторизован
        })

        const post = await doc.save();
        res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось создать статью '
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 }, //Инкрементирует на единицу и обновляет при вызове
            },
            {
                returnDocument: 'after',
            }).populate('user')
            .then((doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья  не найдена',
                    })
                }
                res.json(doc)
            })
            .catch(err => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью '
                    })
                }
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи '
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const authUserId = req.userId


        PostModel.findOneAndDelete({
            _id: postId,


        })
            .then(doc => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья  не найдена',
                    })
                }
                res.json({
                    message: 'success true'
                })
            })
            .catch(err => {

                if (err) {
                    console.log(error)
                    return res.status(500).json({
                        message: 'Не удалось удалить статью '
                    })
                }


            })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи '
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        },
            {

                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user: req.userId //тут мы из checkAuth берем айди пользователя. Того пользователя, который авторизован

            },
        )
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось получить статьи '
        })
    }
}