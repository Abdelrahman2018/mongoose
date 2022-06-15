import { Router } from 'express'
import mongoose, { Schema } from 'mongoose'
import loaders from '../loaders'

const router = Router()
const mongoUri = 'mongodb://localhost/mongo_tuts'
try {
	const dbConnection = mongoose.createConnection(mongoUri)
	const schema = mongoose.Schema
	
	// user schema
	const userSchema = new Schema({
		name: schema.Types.String,
		role: {
			type: schema.Types.String,
			enum: ["client", "admin", "staff"]
		}
	})
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
		author: {
			type: schema.Types.ObjectId,
			ref: "User"
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
		image: schema.Types.Buffer,
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
	postSchema.pre("save", function(next){
		this.comments.push({
			author: {
				role: "client",
			},
		})
		next()
	})

	// pre validate hook
	postSchema.pre("validate", function(next){
		let error = null
		if(this.isModified("comments") && this.comments.length > 0){
			this.comments.forEach(function(value: any, key: any){
				if(!value.text || !value.author.id){
					error = new Error("text & author id required")
				}
			})
		}
		if(error) return next(error)
		next()
	})

	//post save hook
	postSchema.post("save", function(doc){
		console.log("post saaave")
	})

	//add static method
	postSchema.statics.staticMethod = (next) => {
		console.log("post static function")
		next()
	}

	//add inastance method
	postSchema.methods.myMethod = (next: any) => {
		console.log("instance method")
		next()
	}
	const Post = dbConnection.model('Post', postSchema, 'posts')
	const User = dbConnection.model('User', userSchema, 'users')

	router.get('/', async (req, res) => {
		(Post as any).staticMethod(() => {
			res.send('ok')
		})
	})

	router.get('/posts', async (req, res, next) => {
		const q = await Post.find({}, { __v: false }, { limit: 10, sort: { _id: 1 } })
		res.send(q)
	})

	// create new post
	router.post('/posts', async (req, res, next) => {
		const post = new Post(req.body)
		req.busboy.on("file", (fieldName: any, file: any, filename: any, encoding: any, mimetype: any) => {
			file.on('data', function(data: any){
				post.set('image', data)
			  })
			  req.busboy.on('field', function(key: any, value: any, keyTruncated: any, valueTruncated: any) {
				post.set(key, value)
			  });
			  file.on('end', function(){
				console.log('File ' + filename + ' is ended');
			  })
		})

		req.busboy.on("finish", () => {
			post.validate((err: any) => {
				if (err) return next(err)
				post.save((err: any, result: any) => {
					if (err) return next(err)
					res.send(result.toJSON({ getters: true }))
				})
			})
		})
	
	})

	// create new user
	router.post('/users', async(req, res, next) => {
		const user  = new User(req.body)
		try {
			const result = await user.save()
			res.send(result.toJSON())
		} catch (error) {
			return next(error)
		}
	})

	// get post
	router.get('/posts/:id', async (req, res, next) => {
		const postId = req.params.id
		try {
			const post = await Post.findById(postId).populate("author")
			post.myMethod(() => {})
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
