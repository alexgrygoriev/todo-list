<template>
  <div>
      <v-btn color="blue lighten-2" class="ma-3 white--text font-weight-black" @click="formDialog = true; resetOrInitData({})">
        <v-icon left dark
            class="mr-0 mr-md-2"
        >mdi-playlist-plus</v-icon>
        <span class="d-none d-md-block">Add new list</span>
      </v-btn>

      <v-dialog v-model="formDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
        <v-card tile>
          <v-toolbar flat dark color="blue darken-4">
            <v-btn icon dark @click="formDialog = false; resetOrInitData({})">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Form</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="submitData()">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-form>
            <v-list three-line subheader>
              <v-list-item>
                <v-list-item-content>
                  <v-col cols="12" md="6">
                    <v-text-field
                        v-bind:class="{ hasError: errors.title }"
                        v-model="title"
                        :counter="999"
                        label="Title"
                        required
                    ></v-text-field>
                  </v-col>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-col cols="12" md="6">
                    <v-textarea
                        v-bind:class="{ hasError: errors.desc }"
                        v-model="desc"
                        name="input-7-1"
                        label="Description"
                        value=""
                        hint="Your description"
                    ></v-textarea>
                  </v-col>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list three-line subheader>
              <v-list-item>
                <v-col cols="12" md="6">
                  <v-dialog ref="dialog" v-model="datePicker" :return-value.sync="dueDate" persistent width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          v-model="dueDate"
                          label="Due date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dueDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="datePicker = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.dialog.save(dueDate)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-spacer></v-spacer>
              </v-list-item>

              <v-list-item>
                <v-list-item-action>
                  <v-checkbox v-model="isComplete"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Is ready?</v-list-item-title>
                  <v-list-item-subtitle>Please click if you have already completed.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-form>

          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>

import { HTTP } from '@/http'
import { eventBus } from '@/main'
import moment from 'moment'

export default {
  data() {
    return {
      // Form Data
      id: 0,
      title: '',
      desc: '',
      dueDate: moment().format('YYYY-MM-DD'),
      isComplete: false,

      // Service props
      formDialog: false,
      datePicker: false,

      // Validation data
      errors: {
        title: false,
        desc: false
      }
    }
  },

  mounted () {
    eventBus.$on('editTodo', (todo) => {
      this.resetOrInitData(todo)
      this.formDialog = true
    })
  },

  methods: {
    resetOrInitData(data) {
      this.title = data.title || ''
      this.desc = data.desc || ''
      this.dueDate = data.dueDate || ''
      this.isComplete = data.isComplete || false
      this.id = data.id || 0

      this.dueDate = this.dueDate === ''
          ? moment().format('YYYY-MM-DD')
          : moment(this.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
    },

    submitData() {
      let isValidData = () => {
        this.errors.title = this.title.length < 3
        this.errors.desc = this.desc.length < 3

        return !this.errors.title &&
          !this.errors.desc
      }

      if (isValidData()) {
        this.formDialog = false

        let params = {
          title: this.title,
          desc: this.desc,
          isComplete: this.isComplete,
          dueDate: moment(this.dueDate).format()
        }

        if (parseInt(this.id) > 0) {
          HTTP.put('/todos/' + this.id, params).then(response => {
            if (response.status === 200) {
              this.resetOrInitData({})
            }

            eventBus.$emit('todoListChanged', true)
          }).catch(e => {
            console.log(e)
          })
        } else {
          HTTP.post('/todos', params).then(response => {
            if (response.status === 200) {
              this.resetOrInitData({})
            }

            eventBus.$emit('todoListChanged', true)
          }).catch(e => {
            console.log(e)
          })
        }
      }
    },
  }
}
</script>