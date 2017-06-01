const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://192.168.100.83:27017/winter");

initItem();

function initItem() {
    const StyleItem = require('./models/StyleItem');
    const items = [
        { _id: '1', type: 'ttl-1', html: '<div style="width: 300px; height: 30px; padding: 3px 3px; color: white; background-color: #1f7e9a; border-radius: 5px">标题-编号标题</div>' },
        { _id: '2', type: 'ttl-2', html: '<div style="width: 200px; height: 30px; padding: 3px 3px; color: white; background-color: #3d9970; border-radius: 5px">标题-线框标题</div>' },
        { _id: '3', type: 'pgh-1', html: '<div style="width: 100px; height: 40px; padding: 3px 3px; color: white; background-color: #1f7e9a; border-radius: 5px">段落文字-边框内容</div>' },
        { _id: '4', type: 'pgh-2', html: '<div style="width: 160px; height: 40px; padding: 3px 3px; color: white; background-color: #95144b; border-radius: 5px">段落文字-底色内容</div>' }
    ];

    items.forEach(item => {
        let t1 =  new StyleItem({
            name: item.name || '',
            type: item.type,
            types: [item.type.split('\-')[0], item.type],
            html: item.html,
            status: 0,
            sort: 0
        });

        t1.save();
    });
}

//initType();

function initType() {
    const StyleType = require('./models/StyleType');
    const types = [
        { _id: 'ttl', name: '标题', level: 1, children: [
            { _id: 'ttl-1', name: '编号标题', level: 2 },
            { _id: 'ttl-2', name: '线框标题', level: 2 },
            { _id: 'ttl-3', name: '图片标题', level: 2 }
        ] },
        { _id: 'pgh', name: '段落文字', level: 1, children: [
            { _id: 'pgh-1', name: '边框内容', level: 2 },
            { _id: 'pgh-2', name: '底色内容', level: 2 }
        ] },
        { _id: 'img', name: '单图多图', level: 1, children: [
            { _id: 'img-1', name: '单图', level: 2 },
            { _id: 'img-2', name: '多图', level: 2 }
        ] },
        { _id: 'bgr', name: '背景图', level: 1, children: [
            { _id: 'bgr-1', name: '信纸', level: 2 },
            { _id: 'bgr-2', name: '异形', level: 2 }
        ] },
        { _id: 'pl', name: '分割线', level: 1, children: [
            { _id: 'pl-1', name: '线条', level: 2 },
            { _id: 'pl-2', name: '图片', level: 2 }
        ] },
        { _id: 'ft', name: '关注和原文', level: 1, children: [
            { _id: 'ft-1', name: '顶部关注', level: 2 },
            { _id: 'ft-2', name: '底部提示', level: 2 }
        ] }

    ];

    types.forEach(type => {
        let t1 =  new StyleType({
            _id: type._id,
            name: type.name,
            level: type.level,
            parent: type._id,
            status: 0,
            sort: 0
        });

        t1.save();

        type.children.forEach( tc => {
            let t2 =  new StyleType({
                _id: tc._id,
                name: tc.name,
                level: tc.level,
                parent: type._id,
                status: 0,
                sort: 0
            });

            t2.save();
        } )
    });
}