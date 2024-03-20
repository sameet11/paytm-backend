const {z}=require('zod');

const signupBody = z.object({
    username: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	password: z.string()
})
const signinBody = z.object({
    username: z.string().email(),
	password: z.string()
})
const updateBody=z.object({
    password:z.string().optional(),
    lastname:z.string().optional(),
    firstname:z.string().optional(),
})
const transferBody=z.object({
    to:z.string(),
    amount:z.number(),
})
module.exports={
signupBody,
signinBody,
updateBody,
transferBody,
}