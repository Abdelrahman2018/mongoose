import { Router } from 'express'
import mongoose from 'mongoose'
import loaders from '../loaders'

const router = Router()
const mongoUri = 'mongodb://localhost/mongo_tuts'
try {
	const dbConnection = mongoose.createConnection(mongoUri)
	const schema = mongoose.Schema
	const postSchema = new schema({
		title: {
			type: String,
			required: true,
			trim: true,
			set: function (value: string) {
				return value.toUpperCase()
			},
			get: function (value: string) {
				return value.toLowerCase()
			},
		},
		text: {
			type: String,
			required: true,
			max: 2000,
		},
		viewCounter: {
			type: Number,
		},
		published: Boolean,
		followers: [schema.Types.ObjectId],
		meta: schema.Types.Mixed,
		comments: [
			{
				text: {
					type: String,
					max: 2000,
					trim: true,
				},
				author: {
					id: {
						type: schema.Types.ObjectId,
						ref: 'User',
					},
					role: {
						type: String,
						enum: ['admin', 'client'],
					},
				},
			},
		],
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	})
	const psitiveNumber = function (value: number) {
		if (value > 0) return true
		else return false
	}

	postSchema.path('viewCounter').validate(psitiveNumber)
	postSchema.virtual('hasComments').get( function(){
		return this.comments.length > 0
	})
	const Post = dbConnection.model('Post', postSchema, 'posts')

	router.get('/', async (req, res) => {
		res.send('ok')
	})

	router.get('/posts', async (req, res, next) => {
		const q = await Post.find({}, { __v: false }, { limit: 10, sort: { _id: 1 } })
		res.send(q)
	})

	router.post('/posts', async (req, res, next) => {
		const post = new Post(req.body)
		post.validate((err: any) => {
			if (err) return next(err)
			post.save((err: any, result: any) => {
				if (err) return next(err)
				res.send(result.toJSON({ getters: true }))
			})
		})
	})

	router.get('/posts/:id', async (req, res, next) => {
		const postId = req.params.id
		try {
			const post = await Post.findById(postId)
			res.send(post.toJSON({virtuals: true}))
		} catch (error) {
			return next((error as Error).message)
		}
	})

	router.put('/posts/:id', async (req, res, next) => {
		const postId = req.params.id
		try {
			const post = await Post.updateOne({ _id: postId }, { ...req.body })
			res.send(post)
		} catch (error) {
			return next((error as Error).message)
		}
	})

	router.delete('/posts/:id', async (req, res, next) => {
		const result = await Post.remove({ _id: req.params.id })
		res.send(result)
	})
} catch (error) {
	console.log((error as Error).message)
}

export default router
