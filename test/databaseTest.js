var Database = require('../lib/Database');

describe('Database', function () {
  var query;
  var model = {
    fields : {
      'created': {
        as: '`created`'
      },
      'ormy': {
        as: '`ormy`'
      },
      'label': {
        as: '`label`'
      },
      'name': {
        as: '`name`'
      }
    }
  };

  Database = Database.extend({
    init: function() {}
  });
  query = new Database();
  it('should prepare query segment for order when with array content', function () {
    var order = [
      ['created'],
      ['ormy', 'desc'],
      ['label', 'asc']
    ];
    is.same(query.getOrderBy(model, order),' ORDER BY `created` , `ormy` desc, `label` asc');
  });

  it('should prepare query segment for order when with string', function () {
    var order = 'name asc';
    is.same(query.getOrderBy(model, order),' ORDER BY `name` asc');
  });

  it('empty order should return empty string', function () {
    var order = [];
    is.same(query.getOrderBy(model, order),'');
  });

  it('undefined order should return empty string', function () {
    is.same(query.getOrderBy(),'');
  });

  it('sample sql injection should return empty string', function () {
    var order = [['created;DROP TABLE customers']];
    is.same(query.getOrderBy(model, order),'');
  });

  it('order should not build if it contains fields that are not in model.fields', function () {
    var order = [
      ['test'],
      ['fake','asc']
    ];
    is.same(query.getOrderBy(model, order), '');
  });

  it('should prepare query segment for order when pass in a string with multiple field that are in model.fields', function () {
    var order = 'created, ormy desc, label asc';
    is.same(query.getOrderBy(model, order),' ORDER BY `created` , `ormy` desc, `label` asc');
  });

  it('should prepare query segment for order when pass in a string with multiple field that are in model.fields and filter out illegitimate fields', function () {
    var order = 'test, ormy desc, fake asc';
    is.same(query.getOrderBy(model, order),' ORDER BY `ormy` desc');
  });

  it('should prepare query segment for order when pass in a string and filter out the potential sql injection', function () {
    var order = 'created, ormy desc;DROP TABLE customers order by 1, test';
    is.same(query.getOrderBy(model, order),' ORDER BY `created` , `ormy` desc');
  });

  it('passing object', function () {
    var order = {
      a: 1,
      b: 2
    };
    is.same(query.getOrderBy(model, order), '');
  });
});