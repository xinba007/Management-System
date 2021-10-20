// 删除事件
$('.update .sc').click(function() {
    let isTrue = confirm('确定删除该内容吗');
    if (isTrue) {
        let userName = $(this).parents('tr').find('.user_name').text().trim();
        let page = $(this).attr('data-page');
        location.href = `/api/remove?page=${page}&user_name=${userName}`;
    }
});
$('[data-id=sc]').click(function() {
    if (confirm('确定要删除这个商品吗')) {
        location.href = $(this).attr('data-href');
    }
});
// 修改事件
let myPower = $('p[title=权限]').text().trim();

$('.update .xg').click(function() {
    $('.updateUser').show();
    $('.updateUser [name="user_name"]').val($(this).parents('tr').children('td').eq(2).text().trim());
    $('.updateUser [name="user_psw"]').val($(this).parents('tr').children('td').eq(3).text().trim());
    $('.updateUser [name="user_tel"]').val($(this).parents('tr').children('td').eq(4).text().trim());
});
$('[data-id=bj]').click(function() {
    console.log(this);
    $('.updatePro').show();
    $('.updatePro [name="pro_name"]').val($(this).parents('tr').children('td').eq(2).text().trim());
    $('.updatePro [name="pro_price"]').val($(this).parents('tr').children('td').eq(3).text().trim());
    $('.updatePro [name="pro_sort"]').val($(this).parents('tr').children('td').eq(4).text().trim());
});
// 关闭修改框
$('.updateUser i').click(function() {
    $(this).parents('.updateUser').hide();
});
$('.updatePro i').click(function() {
    $(this).parents('.updatePro').hide();
});
// 权限设置
if (myPower == '管理员') {
    $('.power:contains(管理员)').next().find('a').addClass('no').off();
}

if (myPower == '超级管理员' || myPower == '迷你超级管理员' || myPower == '管理员') {
    $('.update a').addClass('p');
    $('.power:contains(超级管理员)').next().find('a').removeClass('p').addClass('no').off();
} else {
    $('.update a').addClass('no').off();
    $('.content-a2 button').attr('disabled', true).text('您没有权限');
}
// 自己的信息修改事件
if (myPower != '超级管理员' && myPower != '迷你超级管理员') {
    $('.a1-table-active .update .xg').addClass('p').removeClass('no');
    $('.a1-table-active .update .xg').click(function() {
        if (myPower == '普通成员') {
            $('.gly').hide()
        } else {
            $('.gly').show();
        }
        $('.updateUser').show();
        $('.updateUser [name="user_name"]').val($(this).parents('tr').children('td').eq(1).text().trim());
        $('.updateUser [name="user_psw"]').val($(this).parents('tr').children('td').eq(2).text().trim());
        $('.updateUser [name="user_tel"]').val($(this).parents('tr').children('td').eq(3).text().trim());
    });

}


// 搜索框
$('#c-search').click(function() {
    sessionStorage.removeItem('num');
    let str = $(this).prev().val().trim();
    location.href = '/api/search?user_name=' + str;
});