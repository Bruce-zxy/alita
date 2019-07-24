import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

export default () => (
    <div className="align" style={{ width: "30vw", height: "30vw", position: "fixed", top: "calc(50% - 15vw)", left: "calc(50% - 15vw)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#A1A1A1", borderRadius: "6px", color: "#EFEFEF" }}>
        <ActivityIndicator size="large" />
        <span style={{ marginTop: 8 }}>加载中，请稍候</span>
    </div>
)