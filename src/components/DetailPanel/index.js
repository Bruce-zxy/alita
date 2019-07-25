import React from 'react';
import './index.scss';

export default (props) => (
    <div className={`detail-panel ${props.className || ''}`}>
        <p className="panel-title">{props.title || ''}</p>
        {props.children ? (
            <div className="panel-children">{props.children}</div>
        ) : (
            <p className="panel-content">{props.content || ''}</p>
        )}
    </div>
)