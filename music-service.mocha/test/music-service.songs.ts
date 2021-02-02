//Dependencies
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
import { expect } from 'chai';
const should = chai.should();

//Environment Variables
import { configEnv } from '../config.env';
import { assert } from 'console';
//const env = configEnv[process.env.NODE_ENV];
//console.log('Environment Parameters', env);

describe('Music Service Songs:', function () {

  describe('Music Service - Get Songs', function () {

    it('Should successfully get a list of Songs', function (done) {
      chai.request(configEnv.local.url)
        .get('/Songs')
        .end(function (err, res) {
          console.log(res.body)
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    })

  });

  describe('Music Service - Filter Songs by Album Name', function () {

    it('Should successfully filter songs by album name', function (done) {
      chai.request(configEnv.local.url)
        .get('/albums').query({ name: 'Drones' })
        .end(function (err, res) {
          var body = res.body
          var album_id_value = body[0]['id'];
          res.should.have.status(200);
          res.should.be.json;

          chai.request(configEnv.local.url)
            .get('/songs').query({ album_id: album_id_value }) //pass album id extracted from albums endpoint passing album name
            .end(function (err, res) {
              var body = res.body
              res.should.have.status(200);
              res.should.be.json;
              for (var item in body)
                expect(body[item]['album_id']).equal(album_id_value)  //verify each album id in response body is equal to album id parameter value in endpoint
            });
          done();
        })
    });

    describe('Music Service - Filter Songs by Artist Name', function () {

      it('Should successfully filter songs by Artist Name', function (done) {
        chai.request(configEnv.local.url)
          .get('/artists').query({ name: 'Duran Duran' })
          .end(function (err, res) {
            var body = res.body
            var artist_id_value = body[0]['id']; //extract artist id from artist name
            res.should.have.status(200);
            res.should.be.json;

            chai.request(configEnv.local.url)
              .get('/albums').query({ artist_id: artist_id_value }) //pass artist id to albums api extracted from artist endpoint passing album name
              .end(function (err, res) {
                var body = res.body
                var album_id_value = body[0]['id']; //extract album id from artist id
                res.should.have.status(200);
                res.should.be.json;

                chai.request(configEnv.local.url)
                  .get('/songs').query({ album_id: album_id_value }) //pass album id extracted from albums endpoint by passing artist id extracted from passing artist name
                  .end(function (err, res) {
                    var body = res.body
                    var album_id_value = body[0]['album_id']; //extract album id
                    res.should.have.status(200);
                    res.should.be.json;
                    for (var item in body)
                      expect(body[item]['album_id']).equal(album_id_value)  //verify each album id in response body is equal to album id parameter value in endpoint
                  });
              });
            done();
          })
      });

      describe('Music Service - Sort Songs by Song Name', function () {

        it('Should successfully sort songs by Song Name', function (done) {

          chai.request(configEnv.local.url)
            .get('/songs')          //get unsorted listof songs
            .end(function (err, res) {
              var body = res.body
              var song_names = []
              for (var item in body)
                song_names.push(body[item]['name']);  //get names
              var sorted_song_names = song_names.sort();   //sort song names in asc order

              chai.request(configEnv.local.url)
                .get('/songs').query({ _sort: 'name' })  //get sorted song namnes in asc order(default)
                .end(function (err, res) {
                  var body = res.body
                  var asc_song_names = []
                  for (var item in body)
                    asc_song_names.push(body[item]['name']);

                  expect(asc_song_names).to.eql(sorted_song_names);  //compare both arrays
                  done();
                });
            });

          describe('Music Service - Sort Songs by Name in DESC order', function () {

            it('Should successfully sort songs by Name in Desc order', function (done) {

              chai.request(configEnv.local.url)
                .get('/songs')          //get unsorted list of songs
                .end(function (err, res) {
                  var body = res.body
                  var song_names = []
                  for (var item in body)
                    song_names.push(body[item]['name']);  //get names
                  var sorted_song_names_desc = song_names.sort().reverse();   //sort song names in desc order

                  chai.request(configEnv.local.url)
                    .get('/songs').query({ _sort: 'name', _order: 'desc' })  //get sorted song namnes in asc order(default)
                    .end(function (err, res) {
                      var body = res.body
                      var desc_song_names = []
                      for (var item in body)
                        desc_song_names.push(body[item]['name']);

                      expect(desc_song_names).to.eql(sorted_song_names_desc);  //compare both arrays
                      done();
                    });
                });

              describe('Music Service - Sort Songs by Track', function () {

                it('Should successfully sort songs by Track', function (done) {

                  chai.request(configEnv.local.url)
                    .get('/songs')          //get unsorted list of songs
                    .end(function (err, res) {
                      var body = res.body
                      var track = []
                      for (var item in body)
                        track.push(body[item]['track']);  //get track
                      var sorted_track = track.sort(function (a, b) { return a - b; });   //sort track in asc order numerically


                      chai.request(configEnv.local.url)
                        .get('/songs').query({ _sort: 'track' })  //get sorted song namnes in asc order(default)
                        .end(function (err, res) {
                          var body = res.body
                          var asc_track = []
                          for (var item in body)
                            asc_track.push(body[item]['track']);

                          expect(asc_track).to.eql(sorted_track);  //compare both arrays

                          done();
                        });
                    });


                  describe('Music Service - Sort Songs by Track DESC', function () {

                    it('Should successfully sort songs by Track DESC', function (done) {

                      chai.request(configEnv.local.url)
                        .get('/songs')          //get unsorted list of songs
                        .end(function (err, res) {
                          var body = res.body
                          var track = []
                          for (var item in body)
                            track.push(body[item]['track']);  //get track
                          var sorted_track_desc = track.sort(function (a, b) { return b - a; });   //sort track in DESC order numerically


                          chai.request(configEnv.local.url)
                            .get('/songs').query({ _sort: 'track', _order: 'desc' })  //get sorted song namnes in asc order(default)
                            .end(function (err, res) {
                              var body = res.body
                              var desc_track = []
                              for (var item in body)
                                desc_track.push(body[item]['track']);

                              expect(desc_track).to.eql(sorted_track_desc);  //compare both arrays

                              done();
                            });
                        });

                      describe('Music Service - Sort Songs by Album', function () {

                        it('Should successfully sort songs by Album', function (done) {

                          chai.request(configEnv.local.url)
                            .get('/songs')          //get unsorted list of songs
                            .end(function (err, res) {
                              var body = res.body
                              var album = []
                              for (var item in body)
                                album.push(body[item]['album_id']);  //get album
                              var sorted_album = album.sort(function (a, b) { return a - b; });   //sort album in asc order numerically


                              chai.request(configEnv.local.url)
                                .get('/songs').query({ _sort: 'album_id' })  //get sorted album id  in asc order(default)
                                .end(function (err, res) {
                                  var body = res.body
                                  var asc_album = []
                                  for (var item in body)
                                    asc_album.push(body[item]['album_id']);

                                  expect(asc_album).to.eql(sorted_album);  //compare both arrays

                                  done();
                                });
                            });

                          describe('Music Service - Sort Songs by Album DESC', function () {

                            it('Should successfully sort songs by Album DESC', function (done) {

                              chai.request(configEnv.local.url)
                                .get('/songs')          //get unsorted list of songs
                                .end(function (err, res) {
                                  var body = res.body
                                  var album_id = []
                                  for (var item in body)
                                    album_id.push(body[item]['album_id']);  //get track
                                  var sorted_album_desc = album_id.sort(function (a, b) { return b - a; });   //sort album in DESC order numerically


                                  chai.request(configEnv.local.url)
                                    .get('/songs').query({ _sort: 'album_id', _order: 'desc' })  //get sorted song namnes in asc order(default)
                                    .end(function (err, res) {
                                      var body = res.body
                                      var desc_album = []
                                      for (var item in body)
                                        desc_album.push(body[item]['album_id']);

                                      expect(desc_album).to.eql(sorted_album_desc);  //compare both arrays

                                      done();
                                    });
                                });

                              describe('Music Service - default number of records', function () {

                                it('Should successfully return 10 records by default per page', function (done) {
                                  chai.request(configEnv.local.url)
                                    .get('/songs').query({ _page: '1' })
                                    .end(function (err, res) {
                                      var body = JSON.parse(JSON.stringify(res.body));
                                      expect(Object.keys(body).length).eql(10);
                                      done();
                                    });
                                });

                                describe('Music Service - limit number of records', function () {

                                  it('Should successfully return number records as per limit', function (done) {
                                    chai.request(configEnv.local.url)
                                      .get('/songs').query({ _limit: '7' })
                                      .end(function (err, res) {
                                        var body = JSON.parse(JSON.stringify(res.body));
                                        expect(Object.keys(body).length).eql(7);
                                        done();
                                      });
                                  });

                                  describe('Music Service - test pagination', function () {

                                    it('Should successfully return number records as per limit on given page number', function (done) {



                                      chai.request(configEnv.local.url)
                                        .get('/songs').query({ _page: '4', _limit: '6' }) //page =4 , limit =6 would return song ids 19,20,21,22,23,24
                                        .end(function (err, res) {
                                          const body = JSON.parse(JSON.stringify(res.body));
                                          expect(Object.keys(body).length).eql(6);
                                          var song_ids = []
                                          for (var item in body)
                                            song_ids.push(body[item]['id']);
                                          expect(song_ids).to.eql([19, 20, 21, 22, 23, 24])
                                          done();
                                        });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });

                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

