class Student {
  constructor(id, name, department, semester) {
      this.id = id;
      this.name = name;
      this.department = department;
      this.semester = semester;
      this.enrolledCourses = [];
      this.completedCourses = [];
  }

  calculateAverageGrade() {
      if (this.completedCourses.length === 0) return 0;
      
      const totalGrade = this.completedCourses.reduce((sum, course) => sum + course.grade, 0);
      return totalGrade / this.completedCourses.length;
  }

  enrollInCourse(course) {
      if (this.enrolledCourses.find(c => c.id === course.id)) {
          return false;
      }
      if (this.completedCourses.find(c => c.id === course.id)) {
          return false;
      }
      if (!course.isOpen) {
          return false;
      }
      
      this.enrolledCourses.push({
          id: course.id,
          name: course.name,
          department: course.department
      });
      return true;
  }

  completeCourse(courseId, grade) {
      const courseIndex = this.enrolledCourses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) return false;

      const course = this.enrolledCourses[courseIndex];
      this.enrolledCourses.splice(courseIndex, 1);
      this.completedCourses.push({ ...course, grade });
      return true;
  }
}

export default Student;