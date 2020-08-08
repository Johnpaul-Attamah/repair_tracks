import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../server';
import User from '../models/User';

const should = chai.should();

chai.use(chaiHttp);


describe('Users', () => {
    before((done) => {
        User.deleteMany({}, (err) => { 
           done();           
        });        
    });

    /*
     * Test the /POST route
     */
    describe('/POST new User', () => {
        it('it should not register a user without username field', (done) => {
            let user = {
                name: 'Johnson Peters',
                email: 'johnson@email.com',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('username').eql('Username field is required');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not register a user without a name field', (done) => {
            let user = {
                username: 'Johnson123',
                email: 'johnson@email.com',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name').eql('Name field is required');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not register a user without an Email field', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email').eql('Email is invalid');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not register a user with wrong email field', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                email: 'johnsonemail.com',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email').eql('Email is invalid');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not register a user without password field', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                email: 'johnson@email.com',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password').eql('password field is required');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not register a user with wrong password combinations', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                email: 'johnson@email.com',
                password: 'tohny78',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password').eql(`Password must contain 8 to 15 characters 
      and must contain at least one lowercase letter
      one uppercase letter and at least a number`);
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should not register a user without confirm password field', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                email: 'johnson@email.com',
                password: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password2').eql('Passwords must match');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should register a user', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                email: 'johnson@email.com',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User Created Successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        it('it should not register a user with existing email', (done) => {
            let user = {
                username: 'Johncena123',
                name: 'Johnson Peters',
                email: 'johnson@email.com',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email').eql('email exists.');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('it should not register a user with existing username', (done) => {
            let user = {
                username: 'Johnson123',
                name: 'Johnson Peters',
                email: 'johncena@email.com',
                password: 'johnSON2020',
                password2: 'johnSON2020'
            }
            chai.request(server)
                .post('/api/v1/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('username').eql('username exists.');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });

    });
});

describe('POST /auth/login', () => {
    it('It should login user with email and asign token', (done) => {
        const user = {
            inputValue: 'johnson@email.com',
            password: 'johnSON2020',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('success');
                res.body.should.have.property('message').eql('You are logged in!');
                res.body.should.have.property('token').be.a('string');
                done();
            });
    });

    it('It should login user with username and asign token', (done) => {
        const user = {
            inputValue: 'Johnson123',
            password: 'johnSON2020',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('success');
                res.body.should.have.property('message').eql('You are logged in!');
                res.body.should.have.property('token').be.a('string');
                done();
            });
    });

    it('It should not login user when email/username field missing', (done) => {
        const user = {
            password: 'johnSON2020',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.should.have.property('status').eql('failed');
                res.body.errors.should.have.property('inputValue').eql('Username or email is required');
                done();
            });
    });
    
    it('It should not login user when password field missing', (done) => {
        const user = {
            inputValue: 'Johnson123'
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.should.have.property('status').eql('failed');
                res.body.errors.should.have.property('password').eql('password field is required');
                done();
            });
    });

    it('It should not login user, when email mismatch', (done) => {
        const user = {
            inputValue: 'Johncena@email.com',
            password: 'johnSON2020',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('inputValue').eql('email or username not found.');
                res.body.should.have.property('status').eql('success');
                done();
            });
    });

    it('It should not login user, when username mismatch', (done) => {
        const user = {
            inputValue: 'Johncena123',
            password: 'johnSON2020',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('inputValue').eql('email or username not found.');
                res.body.should.have.property('status').eql('success');
                done();
            });
    });
    it('It should not login user, when password mismatch', (done) => {
        const user = {
            inputValue: 'Johnson123',
            password: 'mypassword',
        };
        chai.request(server)
            .post('/api/v1/auth/login')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('password').eql('password incorrect');
                res.body.should.have.property('status').eql('failed');
                done();
            });
    });
});