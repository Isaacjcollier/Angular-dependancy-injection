(function() {
  'use strict';

  const server = 'http://localhost:3000';
  const app = angular.module('todoApp');

  TodoListCtrl.$inject = ['$http']
  PeopleCtrl.$inject = ['$http', '$q']

  app.controller('TodoListCtrl', TodoListCtrl);

  function TodoListCtrl($http) {

    this.todoToAdd = '';
    this.todos = [];

    this.addTodo = (person) => {
      console.log(person);
      $http.post(`${server}/persons/${person.id}/todos` , {
        completed: false,
        text: this.todoToAdd
      })
      .then((res) => {
        person.todos.push(res.data);
        this.todoToAdd = '';
      })
      .catch((err) => {
        throw err;
      })
    };

  };

  app.controller('PeopleCtrl', PeopleCtrl)

  function PeopleCtrl($http, $q) {
    this.nameToAdd = '';
    this.people = [];

    this.addPerson = (personName) => {
      $http.post(`${server}/persons`, { name: personName })
      .then((res) => {
        res.data.todos = [];
        this.people.push(res.data);
        this.nameToAdd = '';
      })
      .catch((err) => {
        throw err;
      });
    };

    const activate = () => {
      return $http.get(`${server}/persons`)
        .then((people) => {
          console.log(people);
          this.people = people.data;

          let promises = this.people.map((person) => {
            $http.get(`${server}/persons/${person.id}/todos`)
              .then((todos) => person.todos = todos.data)
          });

          return $q.all(promises)
          // Make requests for individual todos
        })
        .catch((err) => {
          throw err;
        });
    };
    activate();
  };

}());
