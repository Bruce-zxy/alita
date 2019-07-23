import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';


export default () => [<Link key={1} to="/app/lvyoto/mine">"NEWS PAGE"</Link>, <Link key={12} to="/app/lvyoto/news/detail">"NEWS DETAIL PAGE"</Link>];