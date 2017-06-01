'use strict';

import React from 'react';

export default class Modal extends React.Component {

    handleChooseType = (type1, type2) => {
        return () => {
            this.props.onChooseType(type1, type2 );
        };
    };

    render() {
        let { types, current } = this.props;
        let comps = [];
        types.forEach(type1 => {
            type1.children.forEach(type2 => {
                let isCurrent = current.types.indexOf(type1._id) != -1 && current.types.indexOf(type2._id) != -1;
                comps.push(
                    <button key={ type2._id } className={ "btn btn-primary " + (isCurrent ? 'current': '') }  type="button" onClick={ this.handleChooseType(type1, type2) }>
                        { type1.name + '-' + type2.name }
                    </button>
                )
            });
        });

        return (
            <div className="modal fade" id="previewModal" tabIndex="-1" role="dialog" aria-labelledby="previewModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3>预览-选择分类</h3>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div dangerouslySetInnerHTML={{ __html: current.html }} ></div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-12">
                                        { comps }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={ this.props.onSave }>保存</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};