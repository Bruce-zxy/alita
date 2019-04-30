import React, {useState, useContext, useEffect} from 'react';
import { ListView, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import HList from '../components/H-List';

import { list_view_data } from '../data';

import ShopContext from '../context/shop';

const gProvinceIndex = {

  // index: 'A', 'B', 'C', ...
  // node: { key: 'xxx', value: 'xxx' }

  'A': [
    {key: 'a1', value: 'a1'},
    {key: 'a2', value: 'a2'},
    {key: 'a3', value: 'a3'},
    {key: 'a4', value: 'a4'},
    {key: 'a5', value: 'a5'},
    {key: 'a6', value: 'a6'},
  ],
  'B': [
    {key: 'b1', value: 'b1'},
    {key: 'b2', value: 'b2'},
    {key: 'b3', value: 'b3'},
    {key: 'b4', value: 'b4'},
    {key: 'b5', value: 'b5'},
  ],
  'C': [
    {key: 'c1', value: 'c1'},
    {key: 'c2', value: 'c2'},
    {key: 'c3', value: 'c3'},
    {key: 'c4', value: 'c4'},
    {key: 'c5', value: 'c5'},
    {key: 'c6', value: 'c6'},
  ],
  'D': [
    {key: 'd1', value: 'd1'},
    {key: 'd2', value: 'd2'},
    {key: 'd3', value: 'd3'},
    {key: 'd4', value: 'd4'},
    {key: 'd5', value: 'd5'},
    {key: 'd6', value: 'd6'},
  ],
}
function genListViewSourceData(ds, dataSource) {
  const dataBlob = {};
  const sectionIDs = [];
  const rowIDs = [];
  Object.keys(dataSource).forEach((index, id) => {
    sectionIDs.push(index);
    dataBlob[index] = index;
    rowIDs[id] = [];

    dataSource[index].forEach((node) => {
      rowIDs[id].push(node.key);
      dataBlob[node.key] = node.value;
    });
  });
  return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
}

const gListViewDS = new ListView.DataSource({
  getRowData              : (dataBlob, sectionID, rowID) => dataBlob[rowID],
  getSectionHeaderData    : (dataBlob, sectionID) => dataBlob[sectionID],
  rowHasChanged           : (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
});
export default (props) => {

  /**
    State & Context
   */
  const shopContext = useContext(ShopContext);
  const [dataSource, setDataSource] = useState(gListViewDS);
  const thisRef = {};

  /**
    Helper Functions
   */

  const toGotoPos = (sectionId, topId) => {
    console.log({sectionId, topId, thisRef});
  }
  
  /**
    Lifecycle
   */

  useEffect(() => {
    console.log('Catalog::useEffect: ', shopContext);
    setDataSource( genListViewSourceData(dataSource, gProvinceIndex) );
  }, []);

  const btn_group = [{
    text: "编辑",
    action: () => {
      console.log('BJ');
    }
  }, {
      text: "确认",
      action: () => {
        console.log('QR');
      }
  }, {
    text: "取消",
    action: () => {
      console.log('QX');
    }
  }]

  /**
    Render
   */

  console.log('!!!catalog::render!!!', {dataSource});

  return (
    <HList 
      className="List"
      datas={list_view_data}
      renderItem={(data) => {
        return (
          <HList.Item className="HLIST-ITEM">
            <HList.Item.Image 
              image={data.thumbnail} 
              radius 
            />
            <HList.Item.Content>
              <HList.Item.Content.Title>{data.title}</HList.Item.Content.Title>
              <HList.Item.Content.Tags 
                tags={data.labels}
              />
              <HList.Item.Content.Price 
                current={data.currPrice}
                origin={data.origPrice}
                highLight="red"
              />
              {/* <HList.Item.Content.Counter 
                onChange={(value) => console.log(value)} 
              /> */}
              <HList.Item.Content.Intro>{data.extra}</HList.Item.Content.Intro>
            </HList.Item.Content>
            {<HList.Item.Extra 
              datas={btn_group} 
            />}
          </HList.Item>  
        )
      }}
    >
    </HList>
  )

  // return (
  //   <div style={{ paddingTop: '44px', position: 'relative' }}>
  //     <ListView.IndexedList
  //       ref={(ref) => (thisRef['listView'] = ref)}
  //       dataSource={dataSource}
  //       useBodyScroll
  //       renderSectionWrapper={sectionID => ( <StickyContainer key={`s_${sectionID}_c`} style={{ zIndex: 4 }} /> )}
  //       renderSectionHeader={sectionData => (
  //         <Sticky>
  //           {({ style }) => (
  //             <div
  //               style={{
  //                 ...style,
  //                 zIndex: 3,
  //                 backgroundColor: sectionData.charCodeAt(0) % 2 ? '#5890ff' : '#F8591A',
  //                 color: 'white',
  //               }}
  //             >{sectionData}</div>
  //           )}
  //         </Sticky>
  //       )}
  //       renderHeader={() => <span>custom header</span>}
  //       renderFooter={() => <span>custom footer</span>}
  //       renderRow={rowData => (<List.Item>{rowData}</List.Item>)}
  //       quickSearchBarStyle={{ top: 85 }}
  //       delayTime={10}
  //       delayActivityIndicator={<div style={{ padding: 25, textAlign: 'center' }}>rendering...</div>}
  //       onQuickSearch={toGotoPos} 
  //     />
  //   </div>
  // )
}
