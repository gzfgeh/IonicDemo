/**
 *
 *                            _ooOoo_
 *                           o8888888o
 *                           88" . "88
 *                           (| -_- |)
 *                           O\  =  /O
 *                        ____/`---'\____
 *                      .'  \\|     |//  `.
 *                     /  \\|||  :  |||//  \
 *                    /  _||||| -:- |||||-  \
 *                    |   | \\\  -  /// |   |
 *                    | \_|  ''\---/''  |   |
 *                    \  .-\__  `-`  ___/-. /
 *                  ___`. .'  /--.--\  `. . __
 *               ."" '<  `.___\_<|>_/___.'  >'"".
 *              | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *              \  \ `-.   \_ __\ /__ _/   .-` /  /
 *         ======`-.____`-.___\_____/___.-`____.-'======
 *                            `=---='
 *        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                      佛祖保佑       永无BUG
 *
 * Created by guzhenfu on 2016/8/1.
 */

angular.module('starter.services')

  .service('dbService', function($q) {
    var _db;
    var dbName = "shcem";

    function dateFix(result) {
      var data = [];
      result.forEach(function (each) {
        data.push(each.doc);
      });
      return data;
    }

    this.initDB = function () {
      _db = new PouchDB(dbName, {adapter : 'websql'});
    };

    this.getOneData = function (id, callback) {
      if (!_db._destroyed) {
        $q.when(_db.get(id)
          .then(function (data) {
            callback(data);
          }));
      }
    };

    //得到所有数据
    this.getAllData = function (callback) {
      if (!_db._destroyed) {
        _db.allDocs({include_docs: true})
          .then(function (result) {
            callback(dateFix(result.rows));
          })
      }
    };

    //增加一条数据
    this.addData = function (data) {
      if (!_db._destroyed) {
        $q.when(_db.post(data));
      }
    };

    //更新一条数据
    this.updateData = function (data) {
      if (!_db._destroyed) {
        //有点问题，没有找到好的方案！！！
        this.getAllData(function (d) {
          for(var i=0; i<d.length; i++){
            if (data._id == d[i]._id){
              data._rev = d[i]._rev;
            }
          }
        });
        _db.get(data._id)
          .then(function(){
              return _db.post(data);
          }).then(function (response) {

          }).catch(function (error) {
            console.log(error);
          })
      }
    };

    //删除一条数据
    this.removeData = function (data) {
      if (!_db._destroyed) {
        $q.when(_db.remove(data));
      }
    };

    this.destroyDB = function () {
      if (!_db._destroyed) {
        _db.destroy();
      }
    }

  });
