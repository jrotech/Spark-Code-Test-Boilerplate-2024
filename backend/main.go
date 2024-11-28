package main

import (
	"encoding/json"
	"net/http"
)

type toDoItem struct {
	Title       string `json:"title"` // very cool feature prepping the fields for their JSON title name
	Description string `json:"description"`
}

// apparently a dynamic array in go is called a slice, and it needs the var keyword to be global
var toDoList = []toDoItem{}

func main() {
	http.HandleFunc("/", ToDoListHandler)
	println("Server running at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	// encounted a CORS error beacuse of the preflight OPTIONS request
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusNoContent) // 204 No Content
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	if r.Method == http.MethodGet {

		json.NewEncoder(w).Encode(toDoList) // send the list as a json file

	} else if r.Method == http.MethodPost {

		var item toDoItem

		err := json.NewDecoder(r.Body).Decode(&item)
		if err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		toDoList = append(toDoList, item)

		// send the new json back as confirmation
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(item)

	} else {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}

}
