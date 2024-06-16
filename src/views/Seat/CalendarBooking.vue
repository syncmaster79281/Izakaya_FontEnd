<!-- 
    0327 23:00 
    
    導入店家ID
-->
<template>
    <div class="resblock pl-16 pr-6 pt-8 pb-12">
        <h2>訂位查詢</h2>
        <hr>
        <form @submit.prevent="searchReservations">
            <br>
            <h4>
                <!-- 手刻日曆 -->
                <div>
                    <div class="row">
                        <!-- <p style="display: inline;">手刻日曆</p> -->
                        <div class="col text-center mb-3">
                            <form @submit.prevent="generateCalendar" style="display: inline;">
                                <h5>
                                    <input type="text" class="text-end year-input" v-model="year">
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    / <input type="text" class="text-center month-input" v-model="month">
                                    <span>&nbsp;&nbsp;&nbsp;</span>
                                    <button type="submit" class="btn btn-sm btn-outline-primary">查詢</button>
                                </h5>
                            </form>
                        </div>
                    </div>
                    <div v-if="calendarGenerated" id="calendarContainer">
                        <table id="eventTable" class="table table-bordered table-responsive">
                            <thead class="table-success text-center">
                                <tr>
                                    <td>日</td>
                                    <td>一</td>
                                    <td>二</td>
                                    <td>三</td>
                                    <td>四</td>
                                    <td>五</td>
                                    <td>六</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(week, index) in calendar" :key="index">
                                    <td v-for="(day, dayIndex) in week" :key="dayIndex"
                                        :class="{ 'not-current-month': !day.inCurrentMonth }">
                                        <div class="tdDay">{{ day.day }}</div>
                                        <template v-if="day.content">
                                            <a v-if="day.content === '今日公休'" class="btn btn-sm btn-primary disabled"
                                                style="color: black;">{{
            day.content }}</a>
                                            <button v-else-if="day.content === '尚未開放'"
                                                class="btn btn-sm btn-primary disabled">{{ day.content }}</button>
                                            <a v-else-if="day.content === '不可選擇'"
                                                class="btn btn-sm btn-primary disabled">{{ day.content }}</a>
                                            <a v-else-if="day.content === '已經額滿'"
                                                class="btn btn-sm disabled  outline">{{
            day.content }}</a>
                                            <a v-else @click="openSelect(month, day.day)"
                                                class="btn btn-sm btn-primary">我要訂位</a>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <hr>
                <div v-if="showTimeSelect">
                    <label for="time">時間：</label>

                    <v-btn v-for="(option, index) in availableTimes" :key="option.value" :value="option.value"
                        :color="option.value == time ? 'orange-lighten-3' : 'orange-lighten-5'" size="small" dark
                        class="me-4" @click="selectTime(option.value)">
                        {{ option.label }}
                    </v-btn>

                    <v-btn @click="changeSeatPage" color="primary">確認</v-btn>
                </div>
            </h4>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            reservations: [],
            calendar: [],
            calendarGenerated: false,
            availableTimes: [],

            showTimeSelect: false,
            time: '17:00', // Default time selection
            date: "",
        };
    },
    methods: {
        async generateCalendar() {
            const startDay = new Date(this.year, this.month - 1, 1).getDay();
            const totalDays = this.daysInMonth(this.month, this.year);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const oneMonthLater = new Date();
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
            const calendar = [];
            let dayCounter = 1;
            for (let i = 0; i < 6; i++) {
                const week = [];
                for (let j = 0; j < 7; j++) {
                    if ((i === 0 && j < startDay) || dayCounter > totalDays) {
                        week.push({ day: '', content: '', inCurrentMonth: false });
                    } else {
                        const currentDate = new Date(this.year, this.month - 1, dayCounter);
                        const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
                        const totalReservedSeats = await this.getTotalReservedSeats(date);
                        let cellContent = '';
                        if (j === 1) {
                            cellContent = '今日公休';
                        } else if (currentDate < today) {
                            cellContent = '不可選擇';
                        } else if (currentDate > oneMonthLater) {
                            cellContent = '尚未開放';
                        } else if (totalReservedSeats['17:00'] >= 1 && totalReservedSeats['18:00'] >= 1 && totalReservedSeats['19:00'] >= 1) {
                            cellContent = '已經額滿';



                            // (totalReservedSeats >= 3) {


                            // cellContent = '已經額滿';
                        } else {
                            cellContent = '我要訂位';
                        }
                        week.push({ day: dayCounter, content: cellContent, inCurrentMonth: true });
                        dayCounter++;
                    }
                }
                calendar.push(week);
            }
            this.calendar = calendar;
            this.calendarGenerated = true;
        },
        // 打開選擇時段(點選我要訂位)
        // 點選我要訂位後再次去搜尋API 上面的關起來
        async openSelect(month, day) {
            // console.log('Day selected:', month, day);
            this.showTimeSelect = true;
            this.day = day; // 存儲選定的日期

            // 調用 API，檢查特定日期的不同時間段的可用性
            this.date = `${this.year}-${month}-${day}`;
            console.log(this.date);
            this.availableTimes = await this.getAvailableTimes(this.date);

            this.time = this.availableTimes[0].value;



        },


        async getAvailableTimes(date) {
            const times = ['17:00', '18:00', '19:00'];
            const availableTimes = [];
            for (const time of times) {
                const response = await axios.get("https://localhost:7259/api/Reservations/GetSeatIsused", {
                    params: { ReservationTime: `${date} ${time}` },
                });
                // 檢查該時間段的可用座位數是否小於 1
                if (response.data < 1) {
                    availableTimes.push({ value: time, label: ` ${time}`, availableSeats: response.data });
                }
            }
            return availableTimes;
        },

        // 以上新增我要訂位後再次去搜尋API
        selectTime(value) {
            this.time = value;
            console.log(this.time);
        },




        // 找資料若是相加>=12 就不顯示
        async getTotalReservedSeats(date) {
            const times = ['17:00', '18:00', '19:00'];
            let totalReservedSeats = {};
            // let totalReservedSeats = 0;
            for (const time of times) {
                const response = await axios.get("https://localhost:7259/api/Reservations/GetSeatIsused", {
                    params: { ReservationTime: `${date} ${time}` },
                });
                totalReservedSeats[time] = response.data; // 这里试图修改常量变量的值
                // totalReservedSeats += response.data;
            }
            return totalReservedSeats;
        },
        daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        },

        changeSeatPage() {
            const branchId = this.$route.query.branchId;
            // 跳轉到另一個頁面，路由名為 'seat'

            this.$router.push({ name: 'seat', query: { branchId: branchId, dateTime: this.date + '-' + this.time } });
        },
    },
};
</script>

<style scoped>
/* .field-select {
    width: 130px;
} */


.resblock {
    background: #e3eae2 0% 0% no-repeat padding-box;
    border: 1px solid #a5bb94;
    margin-top: 80px;
    margin-left: 112px;
    margin-right: 64px;
}

/* 灰色按鈕樣式 */
.disabled {
    background-color: #e9ecef;
    border-color: #e9ecef;
    color: #6c757d;
    pointer-events: none;
}

.outline {
    border: 2px solid black;
}

.year-input {
    width: 40px;
}

.month-input {
    width: 40px;
}
</style>