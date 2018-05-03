import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../pages/layout'
import BookShelf from '../pages/bookshelf'
import MyFavoriteList from '../pages/user/myFavoriteList'
import MyHistory from '../pages/user/myHistory'
import MyOrderList from '../pages/user/myOrderList'
import Home from '../pages/home'
import Category from '../pages/category'
import User from '../pages/user'
import Recharge from '../pages/user/recharge'
import Search from '../pages/search/search'
import SearchResult from '../pages/search/searchResult'
import RecommendList from '../pages/recommend/recommendList'
import CategoryContentList from '../pages/recommend/categoryContentList'
//import MPlayer from '../pages/listen/mplayer'
//import VPlayer from '../pages/video/vplayer'
import Reader from '../pages/read/reader'
import BookInfo from '../pages/read/bookInfo'
import ChapterList from '../pages/read/chapterList'

Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      component : Layout,
      redirect:'/home',
      children :[
        {
          path: 'bookshelf',
          component: BookShelf,
          redirect: '/bookshelf/favorite',
          children:[
            {
              path : 'favorite',
              component : MyFavoriteList
            },
            {
              path : 'history',
              component : MyHistory
            },
            {
              path : 'orderList',
              component : MyOrderList
            }
          ]
        },
        {
          path: 'home',
          component: Home
        },
        {
          path: 'category',
          component: Category
        },
        //用户
        {
          path: 'user',
          component: User
        },
        {
          path: 'recharge',
          component: Recharge
        },
        //推荐内容页
        {
          path: 'recommend/:idxName',
          component: RecommendList
        },
        //类目内容页
        {
          path: 'category/:categoryId',
          component: CategoryContentList
        },
        //书籍详情页
        {
          path: 'bookInfo/:id',
          component: BookInfo
        },
        {
          path:'chapterList/:id',
          component:ChapterList
        },
        //搜索
        {
          path:'search',
          component:Search
        },
        {
          path:'searchResult/:key',
          component:SearchResult
        }
      ]
    },
    {
      path: '/reader/:bookId/:chapterId',
      component: Reader
    }
  ]
})
