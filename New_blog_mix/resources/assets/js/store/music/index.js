import axios from 'axios'
// import jsonp from 'jsonp'
// import qs from 'qs'
// //

const state = {
    ids: [867822471, 150524989, 963404566],
    title: 'Music',
    author: "uercal",
    isload: false,
    isshow: false,
    show_title: 'SHOW',
    bgm: [],
    playbgm: [],
    audio: new Audio()
}

const getters = {
    title: state => state.title,
    author: state => state.author,
    isload: state => state.isload,
    isshow: state => state.isshow,
    show_title: state => state.show_title,
    bgm: state => state.bgm,
    playbgm: state => state.playbgm,
    audio: state => state.audio
}

const actions = {
    Onbgm: ({ commit }, index) => {
        console.log(index);
        let data = state.bgm[index]['tracks'];
        commit('LOADED_TRACKS', { data })
    },
    play: ({ commit }, id, audio) => {
        console.log(id);
        axios.get('/music/getDetail/' + id, {}, {
            headers: {},
            emulateJSON: true
        }).then(res => {
            // console.log(res.data);
            state.audio.src = res.data;
            state.audio.load();
            state.audio.play();

        }).catch(function(res) {
            console.log('error');
            console.log(res);
        });

    },
    getBgm({ commit }, payload) {
        console.log('run getBgm');
        // console.log(payload);
        let data = [];
        let ids = state.ids;
        for (let i of ids) {
            axios.get('/music/getTracks?list_id=' + i).then(res => {
                console.log(res);
                data.push({
                    title: res.data.result.name,
                    src: res.data.result.coverImgUrl,
                    tracks: res.data.result.tracks
                });
            }).catch(function(err) {
                console.log(err)
            });
        }
        commit('LOADED_BGM', { data, payload });
        // commit('SHOWBGM', {});
    },
    showBgm({ commit }) {
        commit('SHOWBGM', {});
    }
}

//传递给vue需要改变的数据（方法）
const mutations = {
    ['LOADED_BGM'](state, { data, payload }) {
        state.bgm = data;
        state.audio = payload.audio;
    },

    ['LOADED_TRACKS'](state, { data }) {
        state.playbgm = data;
        state.isshow = true;
    },

    ['SHOWBGM'](state, {}) {
        state.show_title = state.show_title == 'SHOW' ? 'HIDDEN' : 'SHOW'
        state.isload = !state.isload
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}