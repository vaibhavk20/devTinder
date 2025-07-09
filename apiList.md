# DevTinder 

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

## connectionRequestRouter
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requstId

## userRouter
- GET /user/connections 
- GET /user/requestes
- GET /user/feed - gets youthe profiles of other users on platform

Status: ignore, intersted, accepeted, rejected