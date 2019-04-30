import React from 'react';

/**
 * @name index.js
 * @author HadesZ
 * @date {2019-04-28 10:52:41}
 * @parmas height, color
 * @description null
 * @Example
 * @return {ReactElement}
 */
export default ({ height, color }) => (
    <div 
        className="hdz-space-block"
        style={{
            width: "100%",
            height: height || "10px",
            backgroundColor: color || "transparent"
        }}
    ></div>
)