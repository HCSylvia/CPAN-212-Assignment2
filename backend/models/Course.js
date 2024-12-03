class Course {
  constructor(id, name, department, isOpen = true) {
      this.id = id;
      this.name = name;
      this.department = department;
      this.isOpen = isOpen;
      this.enrolledStudents = [];
  }

  addStudent(student) {
      if (this.isOpen && !this.enrolledStudents.find(s => s.id === student.id)) {
          this.enrolledStudents.push(student);
          return true;
      }
      return false;
  }

  removeStudent(studentId) {
      const index = this.enrolledStudents.findIndex(s => s.id === studentId);
      if (index !== -1) {
          this.enrolledStudents.splice(index, 1);
          return true;
      }
      return false;
  }
}

export default Course;