const videoModel = require('../../models/videoEntity');
const responseFunc = require('../../lib/responseFunc');
const formidable = require('formidable');
const _ = require('lodash')

class Video {
    constructor() {

    }
    async insertVideo(req, res, next) {
        try {
            let title = req.body.title;
            let tags = req.body.tags;
            let description = req.body.description;
            let videoPath = req.body.videoPath;
            let thumbnail = req.body.thumbnail;
            let vid = req.body.vid;
            if (_.isEmpty(title)) {
                throw Error("标题不能为空");
            }
            if (_.isEmpty(tags)) {
                throw Error("标签不能为空");
            }
            if (_.isEmpty(description)) {
                throw Error("描述不能为空");
            }
            if (_.isEmpty(videoPath)) {
                throw Error("视频路径不能为空");
            }
            if (_.isEmpty(thumbnail)) {
                throw Error("缩略图不能为空");
            }
            if (_.isEmpty(vid)) {
                throw Error("vid不能为空");
            }
            let videoInsert = await videoModel.find({
                'title': title
            }).exec();
            if (videoInsert && videoInsert.length > 0) {
                throw Error('标题重复');
            } else {
                let videoObj = {
                    title: title,
                    description: description,
                    tags: tags,
                    thumbnail: thumbnail,
                    vid: vid,
                    videoPath: videoPath
                }
                let newVideo = new videoModel(videoObj);
                newVideo.save();
                let resSendData = responseFunc.renderApiData(res, 1, "", newVideo);
                res.json(resSendData);
            }
        } catch (err) {
            let resSendData = responseFunc.renderApiErr(res, 0, err.message);
            res.json(resSendData);
        }


    }

    async updateVideo(req, res, next) {
        try {
            let id = req.body.id;
            let title = req.body.title;
            let tags = req.body.tags;
            let description = req.body.description;
            let videoPath = req.body.videoPath;
            let thumbnial = req.body.thumbnial;
            let vid = req.body.vid;
            let updateObj = await videoModel.find({
                "_id": id
            }).exec();
            if (!updateObj) {
                throw Error('视频不存在');
            }
            if (!_.isEmpty(title)) {
                updateObj.title = title;
            }
            if (!_.isEmpty(tags)) {
                updateObj.tags = tags;
            }
            if (!_.isEmpty(description)) {
                updateObj.description = description;
            }
            if (!_.isEmpty(videoPath)) {
                updateObj.videoPath = videoPath;
            }
            if (!_.isEmpty(thumbnial)) {
                updateObj.thumbnial = thumbnial;
            }
            if (!_.isEmpty(vid)) {
                updateObj.vid = vid;
            }

            await videoModel.findOneAndUpdate({
                _id: updateObj._id
            }, {
                $set: updateObj
            });
            let resSendData = responseFunc.renderApiData(res, 1, "", updateObj);
            res.json(resSendData);
        } catch (err) {
            let resSendData = responseFunc.renderApiErr(res, 0, err.message);
            res.json(resSendData);
        }


    }

    async getVideosPage(req, res, next) {
        try {
            let pageIndex = req.body.pageIndex || 1;
            let pageSize = req.body.pageSize || 10;
            let status = req.body.status;
            let queryObj = {};
            if (status) {
                queryObj.status = status;
            }
            let videos = await videoModel.find(queryObj).sort({
                    date: -1
                })
                .skip(Number(pageSize) * (Number(pageIndex) - 1)).limit(Number(pageSize)).populate([{
                    path: 'items'
                }]).exec();
            let resSendData;
            let totalCount = await videoModel.count();
            let pageInfo = {
                totalCount,
                current: Number(pageIndex) || 1,
                pageSize: Number(pageSize) || 10
            }
            if (videos && videos.length > 0) {
                resSendData = responseFunc.renderApiPageData(res, 1, "", videos, pageInfo);
            } else {
                resSendData = responseFunc.renderApiPageData(res, 1, "", [], pageInfo);
            }
            res.json(resSendData);
        } catch (err) {
            let resSendData = responseFunc.renderApiErr(res, 0, err.message);
            res.json(resSendData);
        }
    }
}

module.exports = new Video();