const axios = require("axios");

const cookieValue = 'HstCfa4680397=1690107050696; HstCmu4680397=1690107050696; zh_choose=n; user_id=18411; user_name=madou11; user_check=824dacbd03a5499db52e8ba7a7356f47; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png; group_id=3; group_name=VIP%E4%BC%9A%E5%91%98; __51cke__=; HstCnv4680397=31; PHPSESSID=500g2oltfaikbn9k4991pm6rdq; history=%5B%7B%22name%22%3A%22%E3%80%90%E4%B8%9C%E8%88%AA%E7%BD%91%E7%88%86%E9%97%A8%E3%80%91%E9%AB%98%E9%A2%9C%E5%80%BC%E5%9C%A8%E8%81%8C%E7%A9%BA%E5%A7%90%20%E5%A4%A7%E9%87%8F%E4%B8%8D%E9%9B%85%E8%A7%86%E9%A2%91%E6%83%A8%E9%81%AD%E6%B5%81%E5%87%BA%22%2C%22pic%22%3A%22https%3A%2F%2Fimg.hgimg01.com%2Fupload%2Fvod%2F20230412-15%2F9980714fef4c3c931afedb86bc7b4e01.jpg%22%2C%22link%22%3A%22%2Fvodplay%2F179700-1-1.html%22%2C%22part%22%3A%22%E9%AB%98%E6%B8%85%22%7D%2C%7B%22name%22%3A%22%E7%A9%BA%E5%A7%90%E8%A2%AB%E8%BF%B7%E5%A5%B8%E8%A7%86%E9%A2%91%E6%B5%81%E5%87%BA_%E6%8A%8A%E7%A9%BA%E5%A7%90%E6%8B%BF%E6%8D%8F%22%2C%22pic%22%3A%22https%3A%2F%2Fimg.hgimg01.com%2Fupload%2Fvod%2F20230412-15%2F3952756f7efe4aaec3374e9ea11180b4.jpg%22%2C%22link%22%3A%22%2Fvodplay%2F179704-1-1.html%22%2C%22part%22%3A%22%E9%AB%98%E6%B8%85%22%7D%2C%7B%22name%22%3A%22%E4%B8%80%E4%BA%BA%E4%B9%8B%E4%B8%8B%E7%AC%AC%E4%B8%80%E5%AD%A3%22%2C%22pic%22%3A%22https%3A%2F%2Fimg.ffzypic.com%2Fupload%2Fvod%2F20230121-1%2F0eaa1928ffd565c9af7e867c8ec9132c.jpg%22%2C%22link%22%3A%22%2Fvodplay%2F123140-1-1.html%22%2C%22part%22%3A%22%E7%AC%AC01%E9%9B%86%22%7D%2C%7B%22name%22%3A%22%E6%BD%9C%E8%A1%8C%E8%80%85%22%2C%22pic%22%3A%22%2Fupload%2Fvod%2F20230727-1%2F78a68ad482c1253b74599a42cae1bd92.jpg%22%2C%22link%22%3A%22%2Fvodplay%2F180329-1-1.html%22%2C%22part%22%3A%221%22%7D%2C%7B%22name%22%3A%22%E7%A9%BA%E5%B1%8B%E7%9A%84%E5%AB%82%E5%AD%90%22%2C%22pic%22%3A%22%2Fupload%2Fvod%2F20230810-1%2Fe5d29d95e812b71285ee380bdabb4318.jpg%22%2C%22link%22%3A%22%2Fvodplay%2F181511-1-1.html%22%2C%22part%22%3A%22HD%22%7D%5D; HstCns4680397=60; __tins__21465215=%7B%22sid%22%3A%201691815220736%2C%20%22vd%22%3A%204%2C%20%22expires%22%3A%201691817047238%7D; __51laig__=13; HstCla4680397=1691815247684; HstPn4680397=12; HstPt4680397=189'

const config = {
    headers: {
      Cookie: `${cookieValue}`
    }
  };
  

async function getHtml(){
    const res1 = await axios.get(`https://7xi.tv/voddetail/179741.html`, config)
    
    const res = res1.data
    console.log(res)
    // let desc = '';
    // try {
    //     desc = res.match(/name="description" content="(.+?)"/)[1]
    // }catch(error){
    //     response(ctx,4004,'','此类数据有毒')
    //     console.log('错误url地址')
    //     return;
    // }
    // const cover = getCover(res.match(/data-original="(.+?)"/)[1])
    // const title = res.match(/hl-dc-title hl-data-menu">(.+?)</)[1]
    // const watchUrlTitleStr = res.match(/hl-plays-from hl-tabs swiper-wrapper clearfix">([\s\S]+?)<\/div>/g)[0]
    // const watchUrlTitle = watchUrlTitleStr.match(/alt="(.+?)"/g)
    // const watchUrlGroupsStr = res.match(/id="hl-plays-list">([\s\S]+?)<\/ul/g)
    // const episodes = []
    // let i = 0
    // watchUrlGroupsStr.forEach(e => {
    //     const episode = []
    //     let lis = e.match(/<li([\s\S]+?)<\/li>/g)
    //     lis.forEach(e => {
    //         const match = e.match(/<a href="(.+?)">(.+?)<\/a>/)
    //         episode.push({
    //             url: match[1],
    //             name: match[2],
    //         })
    //     })
    //     const title = watchUrlTitle[i++].split(`"`)[1]
    //     episodes.push({
    //         title: title,
    //         urls: episode
    //     })
    // })
    // const data = {
    //     episodes,
    //     desc,
    //     cover,
    //     title
    // }
}

// getHtml()

