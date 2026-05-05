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

        $doctorImages = [
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=300&h=300&fit=crop',
            'https://images.unsplash.com/photo-1590611936760-eeb9ba390dac?w=300&h=300&fit=crop',
        ];

        return [
            'name' => ($role === 'Doctor' ? 'Dr. ' : '') . $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => '+63 09457652624',
            'profile_image' => $this->faker->randomElement($doctorImages),
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
