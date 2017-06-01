'use strict';

const router = require('koa-router')();
const config = require('config');
const parse = require('co-body');

const StyleItem = require('../models/StyleItem');
const StyleType = require('../models/StyleType');

router.get('/', function *() {
    yield this.render('index', { config: { SSO_SERVER: config.get('sso.server'), SSO_CLIENT: config.get('sso.client') }});
});

router.get('/api/getUserInfo', function *() {
    this.body = { status: true, account: this.session.account }
});

router.get('/api/types', function *() {
    let typeList = yield StyleType.find({level: 1});
    let subList = yield StyleType.find({level: 2});

    let results = [];
    typeList.forEach(type => {
        let children = [];
        subList.forEach(sub => {
            if (sub.parent == type._id) {
                children.push(sub);
            }
        });

        type._doc.children = children;
        results.push(type);
    });

    this.body = { status: true, result: results };
});

router.get('/api/styles', function *() {
    let styleList = yield StyleItem.find({ status: { $in: [ 0, 1 ] } }).sort({ updateTime: -1 });

    this.body = { status: true, result: styleList };
});

router.get('/api/style/type/:typeId', function *() {
    let typeId = this.params.typeId;
    let query = { status: { $in: [ 0, 1 ] } };
    if(typeId && typeId != 'undefined') {
        query['types'] = { $all: [typeId] };
    }

    let styleList = yield StyleItem.find(query).sort({ updateTime: -1 });
    this.body = { status: true, result: styleList };
});

router.get('/api/style/status/:status', function *() {
    let status = this.params.status;

    let styleList = yield StyleItem.find({ status: status }).sort({ updateTime: -1 });
    this.body = { status: true, result: styleList };
});

router.post('/api/style/delete/:_id', function *() {
    let _id = this.params._id;
    yield StyleItem.update({ _id: _id }, { $set: { status: -1 } });

    this.body = { status: true };
});

router.post('/api/style/publish/:_id', function *() {
    let _id = this.params._id;
    yield StyleItem.update({ _id: _id }, { $set: { status: 1 } });

    this.body = { status: true };
});

router.post('/api/style/publishAll', function *() {
    yield StyleItem.update({ status: 0 }, { $set: { status: 1 } }, { multi: true });

    this.body = { status: true };
});

router.post('/api/style/undelete/:_id', function *() {
    let _id = this.params._id;
    yield StyleItem.update({ _id: _id }, { $set: { status: 0 } });

    this.body = { status: true };
});

router.post('/api/style/update/:_id', function *() {
    let _id = this.params._id;
    let data = yield parse(this);
    let style = data.style;
    style.updateTime = new Date();

    yield StyleItem.update({ _id: _id }, { $set: style });

    this.body = { status: true };
});

router.post('/api/style/add', function *() {
    let data = yield parse(this);
    let style = data.style;
    let item = new StyleItem({
        name: style.name,
        types: style.types,
        html: style.html,
        status: 0,
        sort: 0,
        createTime: new Date(),
        updateTime: new Date()
    });
    yield item.save();

    this.body = { status: true, style: item };
});

module.exports = router;