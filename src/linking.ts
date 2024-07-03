//Xử lý click link giống website nhưng truy cập vào app
//NotFound ghi tên giống trong cấu hình navigation
const config = {
    screens:{
        NotFound:'*',
        EventDetails:{
            path:'detail/:id'
        },
        Main:{
            path:'main',
            screens:{
                HomeNavigator:{
                    path:'home',
                    screens:{
                        Add:{
                            path:'add'
                        }
                    }
                }
            }
        }
    }
}

const linking:any = {
    prefixes: ['eventhub://app', 'https://eventhub.com'],
    config

}
export default linking