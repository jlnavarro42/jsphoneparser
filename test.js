var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require('fs');
var expect = chai.expect;
var server = require('./server.js');
chai.use(chaiHttp);

//testing GET without a valid phone number -- only works if string after /text/ is empty
describe('GET /', () => {
    it('should return []', () => {return chai.request(server)
        .get('/api/phonenumbers/parse/text/')
        .then(res =>{
            expect(res).to.have.status(204);
        });
    });   
});

//testing GET with a valid phone number
describe('GET /api/phonenumbers/parse/text/Seneca%20Phone%20Number%3A%20416-491-5050', () => {
    it('should return (416) 491-5050', () => {return chai.request(server)
        .get('/api/phonenumbers/parse/text/Seneca%20Phone%20Number%3A%20416-491-5050')
        .then(res =>{
            expect(res).to.have.status(200);
            expect(res.body).to.include('(416) 491-5050');
        });
    });
});

//testing POST with valid .txt file
describe('POST /api/phonenumbers/parse/file', () =>{
    it('should return [(905) 123-1234, (123) 456-7890]', () => {return chai.request(server)
        .post('/api/phonenumbers/parse/file')
        .set('Content-Type','text/plain')
        .attach('file', fs.readFileSync('./phoneNumbers.txt'), 'phoneNumber.txt')
        .then(res =>{
            expect(res).to.have.status(200);
            expect(res.body).to.include('(905) 123-1234', '(123) 456-7890');
        });

    });
});