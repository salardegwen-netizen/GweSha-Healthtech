<?php

namespace Database\Factories;

use App\Models\StaffMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StaffMember>
 */
class StaffMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $role = $this->faker->randomElement(['Doctor', 'Nurse', 'Specialist', 'Administrator']);
        $departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General'];

        return [
            'name' => ($role === 'Doctor' ? 'Dr. ' : '') . $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'role' => $role,
            'department' => $this->faker->randomElement($departments),
            'status' => $this->faker->randomElement(['On Duty', 'Off Duty', 'In Surgery', 'Break', 'On Leave']),
            'title' => match($role) {
                'Doctor' => $this->faker->randomElement(['Chief', 'Specialist', 'Consulting']),
                'Nurse' => $this->faker->randomElement(['RN', 'LPN', 'CNA']),
                default => $role,
            },
        ];
    }
}
