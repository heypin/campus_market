import ajax from './ajax'

export default {
    getLatestGoods:(categoryId,pageNum,pageSize)=>
        ajax(`/goods/category/${categoryId}`,{pg:pageNum,sz:pageSize}),
    getSearchResult:(search,pageNum,pageSize)=>
        ajax(`/goods/search`,{search:search,pg: pageNum,sz:pageSize}),
    getGoodsDetail:(id)=>
        ajax(`/goods/${id}`),
    getCommentsByGoodsId:(id)=>
        ajax(`/comments/goodsId/${id}`),
    getPurchaseOrderByUserId:(userId)=>
        ajax(`/orders/purchase`,{userId:userId}),
    getSoldOrderByUserId:(userId)=>
        ajax(`/orders/sold`,{userId:userId}),
    addWatch:(userId,goodsId)=>
        ajax(`/watch/add`,{userId:userId,goodsId:goodsId}),
    unwatch:(userId,goodsId)=>
        ajax(`/watch/cancel`,{userId:userId,goodsId:goodsId}),
    getAllCategory:()=>
        ajax(`/category/all`),
    getMyProductByUserId:(userId)=>
        ajax(`/user/my-product`,{userId:userId}),
    getWatchList:(userId)=>
        ajax(`/user/watch-list`,{userId:userId}),
    getOrderListByPage:(pageNum,pageSize)=>
        ajax(`/admin/order`,{pg:pageNum,sz:pageSize}),
    updateOrderById:(order)=>
        ajax(`/admin/order`,order,'POST'),

    getPurseListByPage:(pageNum,pageSize)=>
        ajax(`/admin/purse`,{pg:pageNum,sz:pageSize}),
    updatePurseById:(purse)=>
        ajax(`/admin/purse`,purse,'POST'),

    getGoodsListByPage:(pageNum,pageSize)=>
        ajax(`/admin/goods`,{pg:pageNum,sz:pageSize}),
    updateGoodsById:(goods)=>
        ajax(`/admin/goods`,goods,'POST'),

    getUserListByPage:(pageNum,pageSize)=>
        ajax(`/admin/user`,{pg:pageNum,sz:pageSize}),
    updateUserById:(user)=>
        ajax(`/admin/user`,user,'POST'),

    userLogin:(user)=>
        ajax(`/user/login`,user,'POST'),
    userRegister:(user)=>
        ajax(`/user/register`,user,'POST'),
    adminLogin:(admin)=>
        ajax(`/admin/login`,admin,'POST'),
    getUserByToken:(token)=>
        ajax(`/user/refresh`,{token:token}),
    getAdminByToken:(token)=>
        ajax(`/admin/refresh`,{token:token}),
    addComment:(comment)=>
        ajax(`/user/addComment`,comment,'POST'),
    hasWatchGoods:(userId,goodsId)=>
        ajax(`/watch/hasWatch`,{userId:userId,goodsId:goodsId}),

}
