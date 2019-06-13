<template>
  <div class="dealData">
    <el-button @click="mog" type="primary" plain size="big">添加数据</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="入职日期" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="province" label="省份" width="120"></el-table-column>
      <el-table-column prop="city" label="市区" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" width="300"></el-table-column>
      <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick((scope.row))" type="text" size="small" style="margin-left:10px;">查看</el-button>
          <el-button @click="change((scope.row))" type="text" size="small">编辑</el-button>
          <el-button @click="deleteRow((scope.row))" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog 
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false">
      <el-form :label-position="position" :model="form">
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province"></el-input>
        </el-form-item>
        <el-form-item label="市区">
          <el-input v-model="form.city"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="form.zip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog 
    :visible.sync="dialogFormVisible2"
    :close-on-click-modal="false">
      <el-form :label-position="position" :model="form">
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="form.province"></el-input>
        </el-form-item>
        <el-form-item label="市区">
          <el-input v-model="form.city"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="form.zip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="addEmp">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <div class="demo-image__placeholder">
      <div class="block">
        <span class="demonstration">默认</span>
        <el-image :src="imgsrc"></el-image>
      </div>
    </div> -->
  </div>
</template>
<script>
import { constants } from 'fs';
export default {
  mounted() {
    if (window.innerWidth > 500) {
      //this.position = "left";
    } else {
      //this.position = "top";
    }
    this.fileMsg = null;
    this.getTableData();
    console.log('数据处理页面启动');
  },
  onshow(){
    console.log('deal in show');
  },
  methods: {
    getTableData() {
      this.$axios
        .get("/api/user")
        .then(e => {
          this.tableData = e.data.result.users;
        })
        .catch(err => console.log(err));
    },
    handleClick(row) {
      this.$notify({
          title: row.name,
          dangerouslyUseHTMLString: true,
          message: `<p>入职日期:${ row.date }</P>
          <p>省份:${ row.province }</P>
          <p>市区:${ row.city }</P>
          <p>地址:${ row.address }</P>
          <p>邮编:${ row.zip }</P>`
        });
      console.log(row);
    },
    mog() {
      this.dialogFormVisible2 = true;
      this.form = {};
      
    },
    addEmp(){
      this.$axios
        .get("/api/add", {
          params: {
            date: this.form.date,
            name: this.form.name,
            province: this.form.province,
            city: this.form.city,
            address: this.form.address,
            zip: this.form.zip
          }
        })
        .then(e => {
          this.dialogFormVisible2 = false;
          console.log(e);
          this.getTableData();
        })
        .catch(err => console.log(err));
    },
    open() {},
    change(row) {
      this.dialogFormVisible = true;
      let arr = this.tableData;
      this.form = {
        _id: row._id,
        date: row.date,
        name: row.name,
        province: row.province,
        city: row.city,
        address: row.address,
        zip: row.zip
      };
      console.log(arr, row);
    },
    deleteRow(row) {
      this.$axios
        .get("/api/delete", {
          params: {
            _id: row._id
          }
        })
        .then(e => {
          console.log(e);
          this.getTableData();
        })
        .catch(err => console.log(err));
    },
    update() {
      this.dialogFormVisible = false;
      console.log(this.form);
      this.$axios
        .get("/api/update", {
          params: {
            _id: this.form._id,
            date: this.form.date,
            name: this.form.name,
            province: this.form.province,
            city: this.form.city,
            address: this.form.address,
            zip: this.form.zip
          }
        })
        .then(e => {
          console.log(e);
          this.getTableData();
        })
        .catch(err => console.log(err));
    }
    
  },

  data() {
    return {
      position: "left",
      dialogFormVisible2:false,
      labelPosition: "right",
      tableData: this.tableData,
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        _id: "",
        date: "",
        name: "",
        province: "",
        city: "",
        address: "",
        zip: ""
      }
    };
  }
};
</script>
<style lang="scss">
@media screen and (max-width: 500px) {
  .dealData {
    .el-dialog__wrapper {
      .el-dialog {
        width: 300px;
      }
      .el-form-item {
        padding: 0;
      }
    }
  }
}
.dealData {
  .el-dialog__wrapper {
    .el-form-item {
      padding: 0;
    }
  }
}
</style>

