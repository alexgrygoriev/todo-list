<template>
      <v-list-item-group active-class="grey--text" multiple>
        <v-toolbar flat color="transparent" class="mt-2">
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Please write the title of task"
              single-line
              :search-input.sync="search"
          ></v-text-field>
        </v-toolbar>

        <v-list three-line>
          <div v-for="(item, key, index) in todoSearching" :key="item.id">
            <v-list-item >
              <template v-slot:default="{ active }" >
                <v-list-item-action>
                  <v-checkbox :model="todoSearching[key].isComplete" :input-value="todoSearching[key].isComplete" :aria-checked="item.isComplete" @change="markAsComplete(item.id)"></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title
                      v-text="item.title"
                      :class="{done: item.isComplete}"
                  ></v-list-item-title>
                  <v-list-item-subtitle v-text="item.desc"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text v-text="item.dueDate"></v-list-item-action-text>
                  <v-card v-if="active" class="d-flex align-center pa-1">
                    <v-btn text icon color="blue lighten-2" @click="editTodo(item)">
                      <v-icon color="grey darken-2">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn text icon color="red" v-if="item.isComplete" @click="removeItem(item.id)" class="ml-3">
                      <v-icon class="red--text">mdi-close</v-icon>
                    </v-btn>
                  </v-card>
                </v-list-item-action>

              </template>
            </v-list-item>

            <v-divider
                v-if="index < todoList.length - 1"
            ></v-divider>
          </div>
        </v-list>
      </v-list-item-group>
</template>


<script>

import { HTTP } from "@/http"
import { eventBus } from '@/main'
import moment from "moment"

export default {
  name: 'App',

  data: () => ({
    search: null,
    todoList: {},
  }),

  computed: {
    todoSearching () {
      if (!this.search) return this.todoList
      let search = this.search.toLowerCase()

      return Object.values(this.todoList).filter(item => {
        let title = item.title.toLowerCase()
        return title.indexOf(search) !== -1
      })
    },
  },


  methods: {

    removeItem(id) {
      HTTP
        .delete('/todos/' + id)
        .then(() => {
          this.getData()
        })
    },

    getData() {
      HTTP
        .get('/todos')
        .then(
          response => this.todoList = response.data.reduce((todos, todoItem) => {
            todoItem.dueDate = moment(String(todoItem.dueDate)).format('DD/MM/YYYY')
            return {
              ...todos,
              [todoItem.id]: todoItem,
            }
          }, {})
        )
    },

    markAsComplete(id) {
      HTTP
          .patch('/todos/' + id, {
            isComplete: !this.todoList[id].isComplete
          })
          .then(() => {
              this.getData()
          })
          .catch(error => console.log(error))
    },

    editTodo(todo) {
      eventBus.$emit('editTodo', todo)
    }
  },

  mounted () {
    eventBus.$on('todoListChanged', () => {
      this.getData()
    })

    this.getData()
  }
};
</script>


<style lang="scss">
.done {
  text-decoration: line-through;
}
</style>
