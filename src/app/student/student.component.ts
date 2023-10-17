import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Student } from 'src/domain/student';
import { StudentService } from 'src/service/studentservice';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class StudentComponent implements OnInit{

  studentDialog: boolean=false;
  students!: Student[];
  selectedStudents!: Student[] | null;
  student!: Student;
  submitted: boolean = false;




  constructor(private studentService: StudentService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.studentService.getStudents().then((data) => (this.students = data));


    }

    openNew() {
      this.student = {};
      this.submitted = false;
      this.studentDialog = true;
    }

    deleteSelectedStudents() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected students?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.students = this.students.filter((val) => !this.selectedStudents?.includes(val));
                this.selectedStudents = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Students Deleted', life: 3000 });
            }
        });
    }

    editStudent(student: Student) {
        this.student = { ...student };
        this.studentDialog = true;
    }

    deleteStudent(student: Student) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + student.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.students = this.students.filter((val) => val.id !== student.id);
                this.student = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.studentDialog = false;
        this.submitted = false;
    }

    saveStudent() {
        this.submitted = true;

        if (this.student.name?.trim()) {
            if (this.student.id) {
                this.students[this.findIndexById(this.student.id)] = this.student;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
            } else {
                this.student.id = this.createId();
                this.student.image = 'Student-placeholder.svg';
                this.students.push(this.student);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Created', life: 3000 });
            }

            this.students = [...this.students];
            this.studentDialog = false;
            this.student = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.students.length; i++) {
            if (this.students[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

}
