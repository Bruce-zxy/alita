import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';


export default () => [<Link key={1} to="/app/lvyoto/mine">"HOME PAGE"</Link>, <Link key={12} to="/app/lvyoto/home/detail">"HOME DETAIL PAGE"</Link>];