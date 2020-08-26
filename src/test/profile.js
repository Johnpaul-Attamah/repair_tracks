import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import userAccount from './userAuth';
import Profile from '../models/Profile';

const should = chai.should();

chai.use(chaiHttp);

/*
* Test the /POST route
*/

describe('User Profile', () => {
    userAccount();

    before((done) => {
        Profile.deleteMany({}, (err) => {
            done();
        });
    });

    const tokenObject = {};
    const fakeToken = '56hhhi88090990-09jjhbbbtggbll*nbkj';
    const scapeGoatToken = {};
    
    describe('/Post - Create or update profile', () => {
        before((done) => {
            const user = {
                inputValue: 'johnson@email.com',
                password: 'johnSON2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    tokenObject.token = res.body.token;
                    done();
                });
        });

        before((done) => {
            const user = {
                inputValue: 'scapegoat@email.com',
                password: 'scapeGOAT2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    scapeGoatToken.token = res.body.token;
                    done();
                });
        });

        it('should generate token', (done) => {
            tokenObject.should.be.a('object');
            tokenObject.should.have.property('token').not.eql('');
            tokenObject.token.slice(0, 6).should.eql('Bearer');
            done();
        });

        it("Should not create a profile when token didn't match", (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', fakeToken)
                .send(profile)
                .end((err, req) => {
                    req.should.have.status(401);
                    req.body.should.be.eql({});
                    done(err);
                });
        });

        it('it should not create a profile without a handle', (done) => {
            let profile = {
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('handle').eql('Profile handle is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile without a valid handle', (done) => {
            let profile = {
                handle: 'M',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('handle').eql('Handle is between 2 and 40 characters');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create profile without a section field', (done) => {
            let profile = {
                handle: 'Manchi',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('section').eql('Section is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create profile without a valid section field', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'T',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('section').eql('Section is between 2 and 20 characters');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile without branch field', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                location: 'Maitama',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('branch').eql('Branch field is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create profile with no location field', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                status: 'Operations Officer'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('location').eql('location is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create profile without Status field', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('status').eql('Status field is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile with wrong facebook url', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer',
                facebook: 'face'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('facebook').eql('Not a valid URL');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile with wrong youtube url', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer',
                facebook: 'https://facebook.com/manchi',
                youtube: 'man'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('youtube').eql('Not a valid URL');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile with wrong twitter url', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer',
                facebook: 'https://facebook.com/manchi',
                youtube: 'https://youtube.com/manchi',
                twitter: 'man'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('twitter').eql('Not a valid URL');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile with wrong instagram url', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer',
                facebook: 'https://facebook.com/manchi',
                youtube: 'https://youtube.com/manchi',
                twitter: 'https://twitter.com/manchi',
                instagram: 'man'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('instagram').eql('Not a valid URL');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a profile with wrong linkedin url', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer',
                facebook: 'https://facebook.com/manchi',
                youtube: 'https://youtube.com/manchi',
                twitter: 'https://twitter.com/manchi',
                instagram: 'https://instagram.com/manchi',
                linkedin: 'man'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('linkedin').eql('Not a valid URL');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('should create profile for user', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer'
            };
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('newProfile');
                    res.body.newProfile.should.be.a('object');
                    res.body.should.have.property('message').eql('Profile created successfully.');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
        it('should not create profile with existing handle', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Sales',
                branch: 'Enugu',
                location: 'Nsukka',
                status: 'Sales rep',
                facebook: 'https://facebook.com/manchi',
                youtube: 'https://youtube.com/manchi'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', scapeGoatToken.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('handle').eql('handle already exists.');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });
        it('it should create profile with social fields', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Operations Officer',
                facebook: 'https://facebook.com/manchi',
                youtube: 'https://youtube.com/manchi',
                twitter: 'https://twitter.com/manchi',
                instagram: 'https://instagram.com/manchi',
                linkedin: 'https://linkedlin.com/manchi'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userProfile');
                    res.body.userProfile.should.be.a('object');
                    res.body.should.have.property('msg').eql('Profile Updated successfully');

                    res.body.userProfile.should.have.property('social');
                    res.body.userProfile.social.should.be.a('object');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
        it('should update profile when profile exist', (done) => {
            let profile = {
                handle: 'Manchi',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                status: 'Systems Administrator',
                facebook: 'https://facebook.com/manchi',
                youtube: 'https://youtube.com/manchi',
                twitter: 'https://twitter.com/manchi',
                instagram: 'https://instagram.com/manchi'
            }
            chai.request(server)
                .post('/api/v1/profile')
                .set('Authorization', tokenObject.token)
                .send(profile)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('userProfile');
                    res.body.userProfile.should.be.a('object');
                    res.body.should.have.property('msg').eql('Profile Updated successfully');
                    res.body.should.have.property('status').eql('Success');
                    done();
                });
        });
    });
})

// describe('POST /auth/login', () => {
//     it('It should login user with email and asign token', (done) => {
//         const user = {
//             inputValue: 'johnson@email.com',
//             password: 'johnSON2020',
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql('success');
//                 res.body.should.have.property('message').eql('You are logged in!');
//                 res.body.should.have.property('token').be.a('string');
//                 done();
//             });
//     });

//     it('It should login user with username and asign token', (done) => {
//         const user = {
//             inputValue: 'Johnson123',
//             password: 'johnSON2020',
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('status').eql('success');
//                 res.body.should.have.property('message').eql('You are logged in!');
//                 res.body.should.have.property('token').be.a('string');
//                 done();
//             });
//     });

//     it('It should not login user when email/username field missing', (done) => {
//         const user = {
//             password: 'johnSON2020',
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                 res.body.should.have.property('status').eql('failed');
//                 res.body.errors.should.have.property('inputValue').eql('Username or email is required');
//                 done();
//             });
//     });

//     it('It should not login user when password field missing', (done) => {
//         const user = {
//             inputValue: 'Johnson123'
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                 res.body.should.have.property('status').eql('failed');
//                 res.body.errors.should.have.property('password').eql('password field is required');
//                 done();
//             });
//     });

//     it('It should not login user, when email mismatch', (done) => {
//         const user = {
//             inputValue: 'Johncena@email.com',
//             password: 'johnSON2020',
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(404);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                 res.body.errors.should.have.property('inputValue').eql('email or username not found.');
//                 res.body.should.have.property('status').eql('success');
//                 done();
//             });
//     });

//     it('It should not login user, when username mismatch', (done) => {
//         const user = {
//             inputValue: 'Johncena123',
//             password: 'johnSON2020',
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(404);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                 res.body.errors.should.have.property('inputValue').eql('email or username not found.');
//                 res.body.should.have.property('status').eql('success');
//                 done();
//             });
//     });
//     it('It should not login user, when password mismatch', (done) => {
//         const user = {
//             inputValue: 'Johnson123',
//             password: 'mypassword',
//         };
//         chai.request(server)
//             .post('/api/v1/auth/login')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(401);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                 res.body.errors.should.have.property('password').eql('password incorrect');
//                 res.body.should.have.property('status').eql('failed');
//                 done();
//             });
//     });
// });