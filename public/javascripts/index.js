$(function(){
    refreshBlog();
    $("#lev_scroll_part").jScrollPane();
    $("#emoji_content").emoji({
        button: "#emoji_btn",
        showTab: true,
        animation: 'fade',
        icons: [{
            name: "贴吧表情",
            path: "dist/img/tieba/",
            maxNum: 50,
            file: ".jpg",
            placeholder: ":{alias}:",
            alias: {
                1: "hehe",
                2: "haha",
                3: "tushe",
                4: "a",
                5: "ku",
                6: "lu",
                7: "kaixin",
                8: "han",
                9: "lei",
                10: "heixian",
                11: "bishi",
                12: "bugaoxing",
                13: "zhenbang",
                14: "qian",
                15: "yiwen",
                16: "yinxian",
                17: "tu",
                18: "yi",
                19: "weiqu",
                20: "huaxin",
                21: "hu",
                22: "xiaonian",
                23: "neng",
                24: "taikaixin",
                25: "huaji",
                26: "mianqiang",
                27: "kuanghan",
                28: "guai",
                29: "shuijiao",
                30: "jinku",
                31: "shengqi",
                32: "jinya",
                33: "pen",
                34: "aixin",
                35: "xinsui",
                36: "meigui",
                37: "liwu",
                38: "caihong",
                39: "xxyl",
                40: "taiyang",
                41: "qianbi",
                42: "dnegpao",
                43: "chabei",
                44: "dangao",
                45: "yinyue",
                46: "haha2",
                47: "shenli",
                48: "damuzhi",
                49: "ruo",
                50: "OK"
            },
            title: {
                1: "呵呵",
                2: "哈哈",
                3: "吐舌",
                4: "啊",
                5: "酷",
                6: "怒",
                7: "开心",
                8: "汗",
                9: "泪",
                10: "黑线",
                11: "鄙视",
                12: "不高兴",
                13: "真棒",
                14: "钱",
                15: "疑问",
                16: "阴脸",
                17: "吐",
                18: "咦",
                19: "委屈",
                20: "花心",
                21: "呼~",
                22: "笑脸",
                23: "冷",
                24: "太开心",
                25: "滑稽",
                26: "勉强",
                27: "狂汗",
                28: "乖",
                29: "睡觉",
                30: "惊哭",
                31: "生气",
                32: "惊讶",
                33: "喷",
                34: "爱心",
                35: "心碎",
                36: "玫瑰",
                37: "礼物",
                38: "彩虹",
                39: "星星月亮",
                40: "太阳",
                41: "钱币",
                42: "灯泡",
                43: "茶杯",
                44: "蛋糕",
                45: "音乐",
                46: "haha",
                47: "胜利",
                48: "大拇指",
                49: "弱",
                50: "OK"
            }
        }, {
            path: "dist/img/qq/",
            maxNum: 91,
            excludeNums: [41, 45, 54],
            file: ".gif",
            placeholder: "#qq_{alias}#"
        }]
    });
projectfileoptions = {
    uploadUrl: '/file-upload/create',
    uploadAsync: true,
    language : 'zh',
    allowedPreviewTypes : [ 'image' ],
    allowedFileExtensions : [ 'jpg', 'png', 'gif' ],
    maxFileSize : 2000,
    maxFileNum: 9,
    overwriteInitial:false,
    showCaption:false,
    layoutTemplates:{
        footer: '<div class="file-thumbnail-footer" style="display:none">\n' +
        '    <div class="file-caption-name" style="width:{width}">{caption}</div>\n' +
        '    {progress} {actions}\n' +
        '</div>'
    }
}

// 文件上传框
    $('input[class=projectfile]').each(function() {
        var imageurl = $(this).attr("value");

        if (imageurl) {
            var op = $.extend({
                initialPreview : [ // 预览图片的设置
                    "<img src='" + imageurl + "' class='file-preview-image'>", ]
            }, projectfileoptions);

            $(this).fileinput(op);
        } else {
            $(this).fileinput(projectfileoptions);
        }
    });
});
/**
 * 发表博客
 */
function storeBlog() {
    if($("#emoji_content").val() == ""){
        toastr.error("请输入内容后再点发布");
    }else{
        var data = $("#emoji_content").val();
        $.ajax({
            url: '/blogs/create',
            type: 'POST',
            dataType: 'json',
            data: {content:data},
            async: true,
            success: function (e) {
                console.log(e);
                toastr.success('发布成功!');
                $("#emoji_content").val("");
                refreshBlog();
            },
            error: function (msg) {
                console.log(msg.responseText);
            }
        });
    }
}
/**
 * 删除博客
 */
function deleteBlog(e){
    swal({
            title: "",
            text: "确认要删除这条微博吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: '取消',
            closeOnConfirm: true
        },
        function(){
            $.ajax({
                url: '/blogs/delete/' + e,
                type: 'GET',
                async: true,
                success: function(e){
                    console.log(e.success);
                    if(e.success == 1){
                        refreshBlog();
                        toastr.success("删除成功");
                    }
                },
                error: function(msg){
                    console.log(msg.responseText);
                }
            });
        });
}
function showFileInputDiv(event){
    if($(event.target).attr('type') == 'button'){
        var f = $("#attach_btn").attr('data-bool');
        if(f == 'false'){
            $("#attach_btn").attr('data-bool','true');
            $("#fileInputDiv").css('display','block');
        }else{
            $("#attach_btn").attr('data-bool','false');
            $("#fileInputDiv").css('display','none');
        }
    }
}
function refreshBlog() {
    $.ajax({
        url: '/blogs/all',
        type: 'GET',
        dataType: 'json',
        async: true,
        success: function (e) {
            $("#home").empty();
            for(var i=e.length-1; i>=0; i--){
                var html = $("#blog-panel-templet").html()
                    .replace(/\{\$blog.id\$\}/g,e[i]._id)
                    .replace('\{\$blog.user.avatar\$\}',e[i].user.avatar)
                    .replace(/\{\$blog.user.name\$\}/g,e[i].user.name)
                    .replace('\{\$blog.user.level\$\}',e[i].user.level)
                    .replace('\{\$blog.created_atz\$\}',formatDate(e[i].created_at))
                    .replace('\{\$blog.from\$\}',e[i].from)
                    .replace('\{\$blog.content\$\}',e[i].content)
                    .replace('\{\$blog.comments.length\$\}',e[i].comments.length)
                    .replace('\{\$blog.praise\$\}',e[i].praise);
                $("#home").append(html);
            }
            $(".blog-content").emojiParse({
                icons: [{
                    path: "dist/img/tieba/",
                    file: ".jpg",
                    placeholder: ":{alias}:",
                    alias: {
                        1: "hehe",
                        2: "haha",
                        3: "tushe",
                        4: "a",
                        5: "ku",
                        6: "lu",
                        7: "kaixin",
                        8: "han",
                        9: "lei",
                        10: "heixian",
                        11: "bishi",
                        12: "bugaoxing",
                        13: "zhenbang",
                        14: "qian",
                        15: "yiwen",
                        16: "yinxian",
                        17: "tu",
                        18: "yi",
                        19: "weiqu",
                        20: "huaxin",
                        21: "hu",
                        22: "xiaonian",
                        23: "neng",
                        24: "taikaixin",
                        25: "huaji",
                        26: "mianqiang",
                        27: "kuanghan",
                        28: "guai",
                        29: "shuijiao",
                        30: "jinku",
                        31: "shengqi",
                        32: "jinya",
                        33: "pen",
                        34: "aixin",
                        35: "xinsui",
                        36: "meigui",
                        37: "liwu",
                        38: "caihong",
                        39: "xxyl",
                        40: "taiyang",
                        41: "qianbi",
                        42: "dnegpao",
                        43: "chabei",
                        44: "dangao",
                        45: "yinyue",
                        46: "haha2",
                        47: "shenli",
                        48: "damuzhi",
                        49: "ruo",
                        50: "OK"
                    }
                }, {
                    path: "dist/img/qq/",
                    file: ".gif",
                    placeholder: "#qq_{alias}#"
                }]
            });
        },
        error: function (msg) {
            console.log(msg.responseText);
        }
    });
}