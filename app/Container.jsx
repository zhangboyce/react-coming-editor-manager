'use strict';

import React from 'react';
import StyleNav from './StyleNav.jsx';
import StyleList from './StyleList.jsx';
import StyleEditor from './StyleEditor.jsx';

export default class Container extends React.Component {

    constructor(props) {
        super(props);
        this.state = { styles: [], types: [], current: this.__initCurrent__() };
    }

    componentDidMount() {
        $.get('/api/types', json => {
            this.setState({ types: json.result });
        });

        $.get('/api/styles', json => {
            this.setState({ styles: json.result });
        });
    }

    handleClickType = typeId => {
        $.get('/api/style/type/' + typeId , json => {
            this.setState({ styles: json.result });
        });
    };

    handleClickStatus = status => {
        $.get('/api/style/status/' + status , json => {
            this.setState({ styles: json.result });
        });
    };

    handlePublishAll = () => {
        if (window.confirm('确定发布所有草稿箱的样式?')) {
            $.post('/api/style/publishAll', json => {
                if (json.status) {
                    window.location.href = '/';
                }
            });
        }
    };

    handlePublishStyle = style => {
        return () => {
            if (window.confirm('确定发布该样式?')) {
                $.post('/api/style/publish/' + style._id, json => {
                    if (json.status) {
                        this.__deleteStyle__(style._id);
                    }
                });
            }
        };
    };

    handleUnDeleteStyle = style => {
        return () => {
            $.post('/api/style/undelete/' + style._id, json => {
                if (json.status) {
                    this.__deleteStyle__(style._id);
                }
            });
        };
    };

    handleDeleteStyle = style => {
        return () => {
            if (window.confirm('确定删除该样式?')) {
                if (!style._id) {
                    this.__deleteNewStyle__();
                } else {
                    $.post('/api/style/delete/' + style._id, json => {
                        if (json.status) {
                            this.__deleteStyle__(style._id);
                        }
                    });
                }
            }
        };
    };

    handleDoubleClickStyle = style => {
        return () => {
            if (!style._id || style.status == -1) return;
            this.setState({ current: style });
        };
    };

    handleSave = () => {
        let current = this.state.current;
        if (!current || !current.html || !current.html.trim()) return;

        let _id = current._id ;
        let url = _id ? '/api/style/update/' + _id : '/api/style/add';

        $.post(url, { style: current }, json => {
            if (json.status) {
                if (!_id) {
                    this.__deleteNewStyle__();
                    this.setState({ styles: [json.style, ...this.state.styles] })
                } else {
                    this.setState({ current: this.__initCurrent__() });
                }
            }
        });
    };

    handleChange = value => {
        // remove added new current
        if (!value && !this.state.current._id ) {
            this.__deleteNewStyle__();

        } else {
            // add a new current
            let index = this.state.styles.findIndex(style => !style._id);
            if (!this.state.current._id && index == -1) {
                this.__addNewStyle__(value);
            }
            // update current
            else {
                this.setState({ current: Object.assign(this.state.current, { html: value }) });
            }
        }
    };

    handleChooseType = (type1, type2) => {
        this.setState({ current: Object.assign(this.state.current, { types: [ type1._id, type2._id ] }) });
    };

    handleClickNew = () => {
        let index = this.state.styles.findIndex(style => !style._id);
        if (index == -1) {
            this.__addNewStyle__();
        }
    };

    __addNewStyle__ = content => {
        let current = this.__initCurrent__(content);
        this.setState({ current:  current });
        this.setState({ styles: [current, ...this.state.styles] });
    };

    __deleteNewStyle__ = () => {
        let index = this.state.styles.findIndex(style => !style._id);
        if (index != -1) {
            let styles = [...this.state.styles];
            styles.splice(index, 1);
            this.setState({ styles: styles, current: this.__initCurrent__() });
        }
    };

    __deleteStyle__ = _id => {
        let index = this.state.styles.findIndex(style => style._id == _id);
        if (index != -1) {
            let styles = [...this.state.styles];
            styles.splice(index, 1);
            this.setState({ styles: styles });
        }
    };

    __initCurrent__  = html => {
        return { types: ['ttl', 'ttl-1'], html: html || '' };
    };

    render () {
        return (
            <div className="container-fluid">
                <div className="row">
                    <StyleNav types={ this.state.types }
                              onClickStatus={ this.handleClickStatus }
                              onClickType={ this.handleClickType } />

                    <StyleList styles={ this.state.styles }
                               onDoubleClickStyle={ this.handleDoubleClickStyle }
                               onPublishStyle={ this.handlePublishStyle }
                               onUnDeleteStyle={ this.handleUnDeleteStyle }
                               onDeleteStyle={ this.handleDeleteStyle }
                               onPublishAll={ this.handlePublishAll }
                               onClickNew={ this.handleClickNew } />

                    <StyleEditor current={ this.state.current }
                                 types={ this.state.types }
                                 onSave={ this.handleSave }
                                 onChange={ this.handleChange }
                                 onChooseType={ this.handleChooseType } />
                </div>
            </div>
        );
    }
}