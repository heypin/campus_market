import ajax from './ajax'

export default {
    getLatestGoods:(categoryId,pageNum,pageSize)=>
        ajax(`/goods/category/${categoryId}`,{pg:pageNum,sz:pageSize}),
    getSearchResult:(search,pageNum,pageSize)=>
        ajax(`/goods/search`,{search:search,pg: pageNum,sz:pageSize}),
    getGoodsDetail:(id)=>
        ajax(`/goods/${id}`),
    getImagesByGoodsId:(id)=>
        ajax(`/goods/image`,{id:id}),
    getCommentsByGoodsId:(id)=>
        ajax(`/comments/goodsId/${id}`),
    getPurchaseOrderByUserId:(userId)=>
        ajax(`/orders/purchase`,{userId:userId}),
    getSoldOrderByUserId:(userId)=>
        ajax(`/orders/sold`,{userId:userId}),
    addWatch:(userId,goodsId)=>
        ajax(`/watch/add`,{userId:userId,goodsId:goodsId},'POST'),
    unwatch:(userId,goodsId)=>
        ajax(`/watch/cancel`,{userId:userId,goodsId:goodsId},'PUT'),
    getAllCategory:()=>
        ajax(`/category/all`),
    getMyProductByUserId:(userId)=>
        ajax(`/user/my-product`,{userId:userId}),
    getWatchList:(userId)=>
        ajax(`/user/watch-list`,{userId:userId}),
    userLogin:(user)=>
        ajax(`/user/login`,user,'POST'),
    rechargeOrWithdraw:(purse)=>
        ajax(`/purse`,purse,'PUT'),
    userRegister:(user)=>
        ajax(`/user/register`,user,'POST'),
    editUserInfo:(user)=>
        ajax(`/user`,user,'PUT'),
    publishGoods:(goods)=>
        ajax(`/user/publish-goods`,goods,'POST'),
    addPicture:(images)=>
        ajax(`/user/add-picture`,images,'POST'),
    getPublishedGoodsImg:(goodsId)=>
        ajax(`/user/published-goods-img`,{goodsId:goodsId}),
    modifyGoodsById:(goods)=>
        ajax(`/user/modify-goods`,goods,'PUT'),
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
    deliverGoods:(orderId)=>
        ajax(`/orders/deliver`,{orderId:orderId},'PUT'),
    confirmReceipt:(orderId)=>
        ajax(`/orders/receipt`,{orderId:orderId},'PUT'),
    getPurseByUserId:(userId)=>
        ajax(`/purse`,{userId:userId}),
    getReplyToMeComment:(userId)=>
        ajax(`/user/replied-comment`,{userId:userId}),
    readComment:(userId,commentId)=>
        ajax(`/user/read-comment`,{replyUserId:userId,commentId:commentId},'PUT'),
    updateGoodsState:(userId,goodsId,goodsState)=>
        ajax(`/user/goodsState`,{userId:userId,goodsId:goodsId,goodsState:goodsState},'PUT'),


    getOrderListByPage:(pageNum,pageSize)=>
        ajax(`/admin/order`,{pg:pageNum,sz:pageSize}),
    updateOrderById:(order)=>
        ajax(`/admin/order`,order,'PUT'),
    searchOrderByPage:(value,pageNum,pageSize)=>
        ajax(`/admin/order/search`,{value:value,pg:pageNum,sz:pageSize}),
    getPurseListByPage:(pageNum,pageSize)=>
        ajax(`/admin/purse`,{pg:pageNum,sz:pageSize}),
    updatePurseById:(purse)=>
        ajax(`/admin/purse`,purse,'PUT'),

    getGoodsListByPage:(pageNum,pageSize)=>
        ajax(`/admin/goods`,{pg:pageNum,sz:pageSize}),
    updateGoodsById:(goods)=>
        ajax(`/admin/goods`,goods,'PUT'),

    getUserListByPage:(pageNum,pageSize)=>
        ajax(`/admin/user`,{pg:pageNum,sz:pageSize}),
    updateUserById:(user)=>
        ajax(`/admin/user`,user,'PUT'),
}
