import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';
import userProfile from './profile';
import Request from '../models/Request';


const should = chai.should();

chai.use(chaiHttp);

describe('User Requests', () => {

    before((done) => {
        Request.deleteMany({}, (err) => {
            done();
        });
    });

    const tokenObject = {};
    const tokenObject2 = {};
    const fakeToken = '56hhhi88090990-09jjhbbbtggbll*nbkj';
    const scapeGoatToken = {};

    describe('/post - Create requests', ()=> {
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
                inputValue: 'engineer@email.com',
                password: 'engineEER2020',
            };
            chai.request(server)
                .post('/api/v1/auth/login')
                .send(user)
                .end((err, res) => {
                    tokenObject2.token = res.body.token;
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

        it("Should not create a request when token didn't match", (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', fakeToken)
                .send(userRequest)
                .end((err, req) => {
                    req.should.have.status(401);
                    req.body.should.be.eql({});
                    done(err);
                });
        });

        it('it should not create a request without a title', (done) => {
            let userRequest = {
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('title').eql('Request title is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a valid title', (done) => {
            let userRequest = {
                title: 'R',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('title').eql('Title should be between 2 and 40 characters');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a section field', (done) => {
            let userRequest = {
                title: 'Request title',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('section').eql('Section is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a valid section field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 's',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('section').eql('Section is between 2 and 20 characters');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without branch field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('branch').eql('Branch field is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request with no location field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('location').eql('location is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });
        it('it should not create a request without a description field', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('description').eql('Request description field is required');
                    res.body.should.have.property('status').eql('Failed');
                    done();
                });
        });

        it('should create request for user', (done) => {
            const userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'   
            };
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('newRequest');
                    res.body.should.have.property('createdBy');
                    res.body.newRequest.should.have.property('rcode').to.be.a('string');
                    res.body.createdBy.should.have.property('handle').eql('Manchi');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('message').eql('request created successfully');
                    done();
                });
        });
        it('it should not create a request when user have no profile', (done) => {
            let userRequest = {
                title: 'Request title',
                section: 'Technical',
                branch: 'Abuja',
                location: 'Maitama',
                description: 'Details of problems'
            }
            chai.request(server)
                .post('/api/v1/request')
                .set('Authorization', tokenObject2.token)
                .send(userRequest)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('noProfile').eql('Edit profile to continue');
                    res.body.should.have.property('status').eql('failed');
                    done();
                });
        });


    });
});